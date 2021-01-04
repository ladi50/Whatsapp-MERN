import { useCallback, useEffect, useState } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState();
  const [userImage, setUserImage] = useState();
  const [tokenExpDate, setTokenExpDate] = useState();

  const login = useCallback(
    (userId, username, userImage, token, tokenExpDate) => {
      setToken(token);
      setUserId(userId);
      setUsername(username);
      setUserImage(userImage);

      const tokenExpirationDate =
        tokenExpDate || new Date(new Date().getTime() + 60 * 60 * 1000);

      setTokenExpDate(tokenExpirationDate);

      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: userId,
          token: token,
          username: username,
          userImage: userImage,
          expiration: tokenExpDate || tokenExpirationDate.toISOString()
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUsername(null);
    setUserImage(null);
    setTokenExpDate(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (
      userData &&
      userData.token &&
      new Date(userData.expiration) > new Date()
    ) {
      login(
        userData.userId,
        userData.username,
        userData.userImage,
        userData.token,
        new Date(userData.expiration)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpDate) {
      const remainingTime = tokenExpDate.getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, token, tokenExpDate]);

  return { userId, token, username, userImage, login, logout };
};
