const request = require('request-promise-native');

exports.handler = async (event, context) => {
  try {
    const heroes = event.heroes || [];
    console.log('Starting heroes create request', Date.now());
    for (const hero of heroes) {
      await sendRequest({ name: hero });
    }
    console.log('End heroes create request', response, Date.now());
    return true;
  } catch (error) {
    throw error;
  }
};

const sendRequest = async body => {
  console.log('Sending request to server at: ', process.env.API_HOST);
  return request.post({
    url: `${process.env.API_HOST}/api/v1/heroes`,
    headers: {
      'access-key': process.env.API_ACCESS_KEY,
    },
    json: true,
    body,
  });
};
