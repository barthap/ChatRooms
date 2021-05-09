import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';

import { useAuth } from './common/auth';
import PrivateRoute from './components/PrivateRoute';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';

function App() {
  const auth = useAuth();
  return (
    <Router>
      <Route
        exact
        path="/"
        render={() =>
          auth?.isAuthenticated ? <Redirect to="/chatrooms" /> : <Redirect to="/login" />
        }
      />
      <Route path="/login">
        <LoginPage />
      </Route>
      <PrivateRoute path="/chatrooms">
        <ChatPage />
      </PrivateRoute>
    </Router>
  );
}

export default App;
