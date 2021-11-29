const moment = require("moment");

const messageFunction = (id, userName, message) => {
  return {
    id,
    userName,
    message,
    createdAt: moment(Date.now()).format("hh:mm a"),
  };
};
const locationFunction = (id, userName, location) => {
  return {
    id,
    userName,
    location,
    createdAt: moment(Date.now()).format("hh:mm a"),
  };
};

module.exports = { messageFunction, locationFunction };
