import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import { LoggedInAuthRoute, LoggedOutAuthRoute } from './util/AuthRoute';

import MenuBar from './components/Menu';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import SinglePost from './pages/SinglePost';
import Profile from './pages/Profile';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path='/' component={Home} />
          <LoggedInAuthRoute exact path='/login' component={Login} />
          <LoggedInAuthRoute exact path='/register' component={Register} />
          <LoggedOutAuthRoute exact path='/createPost' component={CreatePost} />
          <Route exact path='/user/:id' component={Profile} />
          <Route exact path='/posts/:postId' component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
