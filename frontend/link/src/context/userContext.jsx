import React from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";
import { useState } from "react";

export const UserContext = React.createContext();

export default function UserContextProvider({ children }) {
  const [userData, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  let [edit, setEdit] = useState(false);

  const { serverUrl } = React.useContext(authDataContext);

  const getCurrentUser = async () => {
    try {
      // FIXED: Added /v1 and changed endpoint to match route definition (/currentuser)
      const result = await axios.get(
        `${serverUrl}/api/v1/user/currentuser`,
        {
          withCredentials: true,
        }
      );

      setUserData(result.data.user);
    } catch (error) {
      console.error("Error fetching current user:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (serverUrl) {
      getCurrentUser();
    }
  }, [serverUrl]);

  const value = {
    edit,
    setEdit,
    userData,
    setUserData,
    loading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}