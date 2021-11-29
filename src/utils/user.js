const users = [];

const createNewUser = (id, userName, room) => {
  userName = userName.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!userName || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  const existingUser = users.find((user) => {
    return user.userName === userName && user.room === room;
  });
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }
  const user = {
    id,
    userName,
    room,
  };
  users.push(user);
  return user;
};

const removeUser = (id) => {
  const userIndex = users.findIndex((user) => {
    return user.id === id;
  });
  return users.splice(userIndex, 1)[0];
};

const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

const getUsersInRoom = (room) => {
  return users.filter((user) => {
    return user.room === room;
  });
};

module.exports = { createNewUser, removeUser, getUser, getUsersInRoom };
