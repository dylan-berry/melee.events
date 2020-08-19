const fetch = require('node-fetch');

// Logs timestamp for today and one week from today
let startDate = new Date();
let endDate = new Date();
endDate.setDate(startDate.getDate() + 7);
startDate = (startDate.getTime() / 1000) | 0;
endDate = (endDate.getTime() / 1000) | 0;

// Fetches all SSBM tournaments for the week
const events = async (callback) => {
  const key = process.env.S_KEY;
  const url = 'https://api.smash.gg/gql/alpha';

  const variables = {
    afterDate: startDate,
    beforeDate: endDate
  };

  const query = `
    query totalTournaments($afterDate: Timestamp, $beforeDate: Timestamp) {
      tournaments(query: {
        perPage: 100
        filter: {
          videogameIds: 1
          afterDate: $afterDate
          beforeDate: $beforeDate
        }
      }) {
        nodes {
          id
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
  callback(undefined, tournaments.length);
};

module.exports = events;
