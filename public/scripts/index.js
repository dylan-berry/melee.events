import { formatVenue, formatRules, formatContact, formatTime } from './format.js';

const eventsGrid = document.querySelector('.events-grid');
const noResults = document.querySelector('.no-results');
const submitButton = document.querySelector('.submit-button');
const container = document.querySelector('.container');
const eventDetails = document.querySelector('.event-details');
const addressError = document.querySelector('.address-error');
const addressForm = document.querySelector('.address-edit');
const bannerText = document.querySelector('.banner-text');
let addressInUse = 0;

// Page load
fetch('/events').then((res) => {
  res.json().then((data) => {
    if (data.error) {
      bannerText.innerHTML = `There are 0 Melee events this week!`;
    } else {
      bannerText.innerHTML = `There are ${data.num} Melee events this week!`;
    }
  });
});

// Submit form
const formSubmitted = () => {
  // Check if address is valid or repeated
  let address = document.querySelector('.address-edit').value;
  if (address === addressInUse) {
    return;
  } else {
    addressInUse = address;
  }

  // Clear previous result
  eventsGrid.innerHTML = '';
  noResults.innerHTML = '';

  fetch(`/tournaments?address=${address}`).then((res) => {
    res.json().then((data) => {
      if (data.error) {
        noTournaments();
      } else {
        const tournaments = data;
        createTournaments(tournaments);
      }
    });
  });
};

// Search button clicked
submitButton.addEventListener('click', () => {
  formSubmitted();
});

// Search form entered
addressForm.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    formSubmitted();
  }
});

// Output tournaments to DOM
const createTournaments = (tournaments) => {
  // If any tournaments are found
  if (tournaments) {
    tournaments.forEach((tournament) => {
      let date = new Date(tournament.startAt * 1000);

      // HTML for tournament cards
      let html = `
        <div class="event-card">
          <div class="event-card-info" id="${tournament.id}">
            <img class="event-pic" src="${getImage(tournament.images)}">
            <div class="event-info-basic">
              <p class="event-name">${tournament.name}</p>
              <p class="event-address">${tournament.city}, ${tournament.addrState}</p>
              <p class="event-date">${date.toDateString()}</p>
            </div>
          </div>
          <div class="event-card-bg"></div>
        </div>`;
      eventsGrid.innerHTML += html;
    });

    // Add event listener to event cards so event details will pop up when event cards clicked
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('event-card-info')) {
        document.querySelector('.event-details').style.display = 'block';
        document.querySelector('.event-details-bg').style.display = 'block';
        // HTML for tournament popup containing event details
        tournaments.forEach((tournament) => {
          if (e.target.id == tournament.id) {
            const date = new Date(tournament.startAt * 1000);
            let html = `
            <div class="close-button"><i class="material-icons">close</i></div>
            <h1>${tournament.name}</h1>
            <h3>${date.toDateString()}</h3><br>
            ${formatVenue(tournament.venueName)}
            <p><strong>Location:</strong> ${tournament.venueAddress}</p>
            <p><strong>Time:</strong> ${formatTime(tournament.startAt)}</p>
            <p>${formatContact(tournament.primaryContactType, tournament.primaryContact)}</p>
            ${formatRules(tournament.rules)}
            <br>
            <a href="https://smash.gg/${tournament.slug}" target="_blank">More info</a>`;
            eventDetails.innerHTML += html;
          }
        });
      } else if (e.target.classList.contains('close-button') || e.target.classList.contains('event-details-bg')) {
        document.querySelector('.event-details').style.display = 'none';
        document.querySelector('.event-details-bg').style.display = 'none';
        eventDetails.innerHTML = '';
      }
    });
  }
};

const noTournaments = () => {
  noResults.innerHTML += `<h2>Uh oh!</h2><img class="uh-oh" src="./img/slippy.png">`;
  noResults.style.display = 'block';
  let num = Math.floor(Math.random() * 3);
  if (num === 0) {
    noResults.innerHTML += `
        <div class="not-found">
          <h2>
            No events near you.<br>
            Why don't you <a href="https://smash.gg/create">make one</a>?
          </h2>
        </div>`;
  } else if (num === 1) {
    noResults.innerHTML += `
        <div class="not-found">
          <h2>
            No events near you.<br>
            Watch some Melee on <a href="https://www.twitch.tv/directory/game/Super%20Smash%20Bros.%20Melee">Twitch</a>?
          </h2>
        </div>`;
  } else if (num === 2) {
    noResults.innerHTML += `
        <div class="not-found">
          <h2>
            No events near you.<br>
            Check out <a href="https://www.smashladder.com/">Smash Ladder</a> to play online!
          </h2>
        </div>`;
  }
};

const getImage = (images) => {
  for (let image of images) {
    if (image.type === 'banner') {
      return image.url;
    }
  }
  return './img/ssbm_logo.png';
};
