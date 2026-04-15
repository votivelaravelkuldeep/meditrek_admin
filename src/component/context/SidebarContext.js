// context/SidebarContext.js
import { createContext, useContext } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children, isOpen }) => {
    return (
        <SidebarContext.Provider value={{ isSidebarCollapsed: !isOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);