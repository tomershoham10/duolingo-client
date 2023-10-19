"use client";
import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

interface UserContextType {
    userRole: string;
    isLoggedIn: boolean;
    setUserRole: (userRole: string) => void;
    setLoggedIn: (loggedIn: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const isServer = typeof window === "undefined";

export function UserProvider({ children }: { children: ReactNode }) {
    const [userRole, setRole] = useState<string>("");

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const initializeRole = () => {
        if (isServer) {
            return "";
        }
        try {
            const storedRole = localStorage.getItem("userRole");
            if (typeof storedRole === "string") {
                return storedRole;
            } else return "";
        } catch (error) {
            console.log("userContext", error);
            return "";
        }
    };

    const initializeLogin = () => {
        if (isServer) {
            return false;
        }
        try {
            const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
            return storedIsLoggedIn === "true";
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const setUserRole = (role: string) => {
        console.log(role);
        setRole(role);
    };
    const setLoggedIn = (loggedIn: boolean) => {
        setIsLoggedIn(loggedIn);
    };

    useEffect(() => {
        if (!isServer) {
            setRole(initializeRole());
            setIsLoggedIn(initializeLogin());
        }
    }, []);

    return (
        <UserContext.Provider
            value={{ userRole, isLoggedIn, setUserRole, setLoggedIn }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

export function useUserRole() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context.userRole;
}

export function useLoggedIn() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useLoggedIn must be used within a UserProvider");
    }
    return context.isLoggedIn;
}
