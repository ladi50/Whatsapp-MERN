import { createContext } from "react";

export const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  userId: null,
  username: null,
  userImage: null,
  token: null,
  isLoggedIn: false
})