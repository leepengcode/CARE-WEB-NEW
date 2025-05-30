import { createContext, useContext, useEffect, useState } from "react";

const StateContext = createContext({
  currentUser: {},
  userToken: null,
  setCurrentUser: () => {},
  setUserToken: () => {},
});

export const ContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem("userToken") || null;
  });
  const [surveys, setSurveys] = useState([]);

  // Persist userToken and currentUser to localStorage
  useEffect(() => {
    localStorage.setItem("userToken", userToken || "");
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [userToken, currentUser]);

  return (
    <StateContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userToken,
        setUserToken,
        surveys,
        setSurveys,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
