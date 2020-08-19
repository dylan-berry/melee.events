require('dotenv').config();
const path = require('path');
const express = require('express');
const geocode = require('./utils/geocode.js');
const events = require('./utils/events');
const tournaments = require('./utils/tournaments.js');

const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.get('/events', (req, res) => {
  events((err, data) => {
    if (err) {
      return res.send({
        error: err
      });
    }

    return res.send({
      num: data
    });
  });
});

app.get('/tournaments', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address.'
    });
  }

  geocode(req.query.address, (err, { lat, lng, loc } = {}) => {
    if (err) {
      return res.send({
        error: err
      });
    }

    tournaments(lat, lng, 50, (err, data) => {
      if (err) {
        return res.send({
          error: err
        });
      }

      res.send(data);
    });
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
