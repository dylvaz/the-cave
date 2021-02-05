import React, { useContext, useState } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from "../context/auth";

const MenuBar = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);
  
  const menuBar = user ? ( 
    <Menu pointing secondary size="massive" color="purple">
      <Menu.Item style={{ textTransform: 'lowercase' }}
        name={user.username}
        active={activeItem === user.username || pathname === '/'}
        onClick={handleItemClick}
        as={Link}
        to='/'
      />
      <Menu.Item
        name='Create Post'
        active={activeItem === 'Create Post' || pathname === '/createPost'}
        onClick={handleItemClick}
        as={Link}
        to='/createPost'
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name='logout'
          onClick={logout}
          as={Link}
          to='/login'
        />
      </Menu.Menu>
    </Menu>
  ) : (
      <Menu pointing secondary size="massive" color="purple">
        <Menu.Item
          name='home'
          active={activeItem === 'home' || pathname === '/' }
          onClick={handleItemClick}
          as={Link}
          to='/'
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to='/login'
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to='/register'
          />
        </Menu.Menu>
      </Menu>
    );

  return menuBar;
};

export default MenuBar;
