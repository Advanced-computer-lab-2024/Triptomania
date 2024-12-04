import React, { createContext, useState, useContext } from "react";

// Create User Context
const UserContext = createContext();

// Custom hook to access User Context
export const useUser = () => useContext(UserContext);

// Provider component to wrap the app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
