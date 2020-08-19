const request = require('request');

const geocode = (address, callback) => {
  const key = process.env.G_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${key}`;

  request({ url, json: true }, (err, { body } = {}) => {
    if (err) {
      callback('Unable to connect to location services.', undefined);
    } else if (body.results.length === 0) {
      callback('Unable to find location. Try another search.', undefined);
    } else {
      callback(undefined, {
        lat: body.results[0].geometry.location.lat,
        lng: body.results[0].geometry.location.lng,
        loc: body.results[0].formatted_address
      });
    }
  });
};

module.exports = geocode;
