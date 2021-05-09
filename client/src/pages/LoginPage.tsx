import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import { useAuth } from '../common/auth';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  const history = useHistory();
  const location = useLocation();
  const auth = useAuth();

  const [errMsg, setErrMsg] = React.useState<string | null>(null);

  const { from } = (location.state as any) || { from: { pathname: '/' } };

  const login = async (username: string) => {
    try {
      await auth?.signIn(username);
      history.replace(from);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.message === 'user_already_exists') {
          setErrMsg('This name is already taken');
        } else {
          setErrMsg(e.message);
        }
      } else {
        throw e;
      }
    }
  };

  if (auth?.isAuthenticated) {
    return <Redirect to="/chatrooms" />;
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <LoginForm errorMessage={errMsg} onSubmit={login} />
      </div>
    </div>
  );
}
