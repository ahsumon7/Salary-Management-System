import React, { createContext, useState } from 'react';

// Create the context
export const AppContext = createContext();

// Create the provider
export const AppProvider = ({ children }) => {
    const [companyBalance, setCompanyBalance] = useState(0);
    const [user, setUser] = useState(null); // optional, if you want to share user info

    return (
        <AppContext.Provider value={{ companyBalance, setCompanyBalance, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
};
