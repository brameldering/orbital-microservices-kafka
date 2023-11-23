// Create a context file (e.g., UserContext.tsx)
import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { CURRENT_USER_URL, IUser } from '@orbitelco/common'; // Import your user type/interface here
import configureAxiosBrowser from 'api/configure-axios-browser';

interface UserProviderProps {
  children: ReactNode;
}

// Define the context type
interface UserContextProps {
  userContext: IUser | null;
  // eslint-disable-next-line no-unused-vars
  setUserContext: (user: IUser | null) => void;
}

// Create the context
const UserContext = createContext<UserContextProps>({
  userContext: null,
  setUserContext: () => {},
});

// Create a provider to wrap the app with
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const client = configureAxiosBrowser();
        const { data } = await client.get(CURRENT_USER_URL);
        setUserContext(data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userContext, setUserContext }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a hook to use the context
export const useUserContext = () => useContext(UserContext);
