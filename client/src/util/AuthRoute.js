import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

const LoggedInAuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={props =>
        user ? <Redirect to='/' /> : <Component {...props} />
      }
    />
  );
};

const LoggedOutAuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={props =>
        user ? <Component {...props}/> : <Redirect to='register' />
      }
    />
  );
};


export {
  LoggedInAuthRoute,
  LoggedOutAuthRoute
};
