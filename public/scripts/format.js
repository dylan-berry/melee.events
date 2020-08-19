const formatVenue = venue => {
  if (venue) {
    return `<p><strong>Venue:</strong> ${venue}</p>`;
  } else {
    return `<span></span>`;
  }
};

const formatRules = rules => {
  if (rules) {
    return `
      <br>
      <p><strong>About:</strong></p>
      <p>${rules}</p>`;
  } else {
    return `<span></span>`;
  }
};

const formatContact = (contactType, contactInfo) => {
  if (contactType === 'phone') {
    return `<strong>Phone:</strong> ${contactInfo}`;
  } else if (contactType === 'email') {
    return `<strong>Email:</strong> <a href="mailto:${contactInfo}">${contactInfo}</a>`;
  } else if (contactType === 'discord') {
    return `<strong>Discord:</strong> <a href="${contactInfo}">${contactInfo}</a>`;
  }
};

const formatTime = startTime => {
  const date = new Date(startTime * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  startTime = hours + ':' + minutes + ' ' + ampm;
  return startTime;
};

export { formatVenue, formatRules, formatContact, formatTime };
