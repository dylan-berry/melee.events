const fetch = require('node-fetch');

// Logs timestamp for today and one week from today
let startDate = new Date();
let endDate = new Date();
endDate.setDate(startDate.getDate() + 7);
startDate = (startDate.getTime() / 1000) | 0;
endDate = (endDate.getTime() / 1000) | 0;

// Sort tournaments according to date
const compare = (a, b) => {
  if (a.startAt > b.startAt) {
    return 1;
  } else if (a.startAt < b.startAt) {
    return -1;
  }
};

// Fetches tournament info from smash.gg
const tournaments = async (lat, lng, miles = 50, callback) => {
  const url = 'https://api.smash.gg/gql/alpha';
  const key = process.env.S_KEY;

  const variables = {
    perPage: 10,
    coordinates: `${lat}, ${lng}`,
    radius: `${miles}mi`,
    afterDate: startDate,
    beforeDate: endDate
  };

  const query = `
    query nearbyTournaments($perPage: Int, $coordinates: String!, $radius: String!, $afterDate: Timestamp, $beforeDate: Timestamp) {
      tournaments(query: {
        perPage: $perPage
        filter: {
          location: {
            distanceFrom: $coordinates,
            distance: $radius
          }
          videogameIds: 1
          afterDate: $afterDate
          beforeDate: $beforeDate
        }
      }) {
        nodes {
          addrState
          city
          id
          images {
            url
            type
          }
          name
          primaryContact
          primaryContactType
          rules
          slug
          startAt
          venueAddress
          venueName
        }
      }
    }
  `;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  });

  const data = await res.json();
  const tournaments = data.data.tournaments.nodes;
  if (tournaments) {
    callback(undefined, tournaments.sort(compare));
  } else {
    callback('No tournaments in your area.', undefined);
  }
};

module.exports = tournaments;
