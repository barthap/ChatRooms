import { Sidebar, ExpansionPanel } from '@chatscope/chat-ui-kit-react';
import React, { useState } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuth } from '../common/auth';
import { ChatSocketManager } from '../common/socket';
import { IUser } from '../common/user';
import CookieInfo from './CookieInfo';
import ServerStatus from './ServerStatus';
import UserList from './UserList';

export default function RightSidebar({
  auth,
  socket,
}: {
  auth?: ReturnType<typeof useAuth>;
  socket?: ChatSocketManager;
}) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [sid, setSid] = useState<string | null>(null);

  React.useEffect(() => {
    const usersListener = socket?.onUserListChangedHandlers.addListener(setUsers);
    const connListener = socket?.onConnectHandlers.addListener(setSid);

    return () => {
      usersListener && socket?.onUserListChangedHandlers.removeListener(usersListener);
      connListener && socket?.onConnectHandlers.removeListener(connListener);
    };
  }, [socket]);

  // we need to find current user in `users` list since `auth`
  // doesn't contain room (and other) information
  const currentUser = users.find(u => u.id === auth?.user?.id);

  return (
    <Sidebar position="right">
      <ExpansionPanel open title="INFO">
        <p>
          You are logged in as <b>{auth?.user?.name}</b>
        </p>
        <button className="btn btn-sm btn-primary mb-3" onClick={() => auth?.signOut()}>
          Logout
        </button>
        <CookieInfo />
      </ExpansionPanel>
      <ExpansionPanel open title="ACTIVE USERS">
        <UserList users={users} currentUser={currentUser} />
      </ExpansionPanel>
      <ExpansionPanel title="DEBUG INFO">
        <ServerStatus />
        <p>Your SID: {sid}</p>
        <p>Your username: {auth?.user?.name}</p>
        <p>Your user ID: {auth?.user?.id}</p>
      </ExpansionPanel>
    </Sidebar>
  );
}
