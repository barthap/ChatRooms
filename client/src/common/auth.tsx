import React, { useContext, createContext } from 'react';
import { useCookies } from 'react-cookie';

import { API_URL } from './constants';
import { IUser } from './user';

async function createUser(username: string): Promise<IUser> {
  const response = await fetch(`${API_URL}/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
    }),
  });

  const body = await response.json();
  if (response.status === 201) {
    return body;
  }
  throw new Error(body.message ?? 'unknown error: ' + JSON.stringify(body));
}

async function deleteUser(userId: string): Promise<void> {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
  });

  if (response.status !== 204) {
    throw new Error('Error when deleting user: ' + (await response.text()));
  }
}

interface IAuth {
  user: IUser | null;
  isAuthenticated: boolean;
  signIn: (username: string) => Promise<IUser>;
  signOut: () => Promise<void>;
  invalidateSession: () => void;
}

/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
const authContext = createContext<IAuth | undefined>(undefined);

export function ProvideAuth({ children }: React.PropsWithChildren<object>) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

function useProvideAuth(): IAuth {
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const user: IUser | null = cookies.user ?? null;

  console.log('hook', user);

  const signIn = async (username: string) => {
    const user = await createUser(username);
    setCookie('user', user, { maxAge: 24 * 60 * 60 });
    return user;
  };

  const signOut = async () => {
    invalidateSession();
    user && (await deleteUser(user.id));
  };

  const invalidateSession = () => {
    removeCookie('user');
  };

  return {
    isAuthenticated: user != null,
    user,
    signIn,
    signOut,
    invalidateSession,
  };
}
