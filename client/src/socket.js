import IO from "socket.io-client";

const options = {
  // reconnectionDelay: 1000,
};

const socket = IO("//localhost:9200", options);

const username = `John${Math.random()}`;
const room = "javascript";

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  console.log(room, users);
});

socket.emit("chatMessage", "Hello world!");

export default socket;
