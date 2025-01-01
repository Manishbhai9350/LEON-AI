import { useContext } from "react";
import { UserContext } from "../context/User.context";

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};

export default useUser;
