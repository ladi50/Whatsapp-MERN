import axios from "axios";

const url = process.env.REACT_APP_BACKEND_URL;
const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const postMessage = (input, roomId, userId, username, token) =>
  axios.post(
    `${url}/messages/new`,
    {
      name: username,
      message: input,
      userId,
      roomId
    },
    authHeader(token)
  );

export const getRooms = (token, userId) =>
  axios.get(`${url}/rooms/${userId}`, authHeader(token));

export const createRoom = (roomData, token) =>
  axios.post(`${url}/room/new`, roomData, authHeader(token));

export const getMessagesByRoom = (roomId, token) =>
  axios.get(`${url}/${roomId}/messages`, authHeader(token));

export const signup = (userData) => axios.post(`${url}/signup`, userData);

export const loginUser = (userData) => axios.post(`${url}/login`, userData);

export const deleteAccount = (userId, token) =>
  axios.delete(`${url}/${userId}/delete`, authHeader(token));
