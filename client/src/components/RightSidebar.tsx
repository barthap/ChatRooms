import { Sidebar, ExpansionPanel } from '@chatscope/chat-ui-kit-react';
import React from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuth } from '../common/auth';
import CookieInfo from './CookieInfo';
import ServerStatus from './ServerStatus';

export default function RightSidebar({
  auth,
  sid,
}: {
  sid?: string;
  auth?: ReturnType<typeof useAuth>;
}) {
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
      <ExpansionPanel open title="DEBUG INFO">
        <ServerStatus />
        <p>Your SID: {sid}</p>
        <p>Your username: {auth?.user?.name}</p>
        <p>Your user ID: {auth?.user?.id}</p>
      </ExpansionPanel>
    </Sidebar>
  );
}
