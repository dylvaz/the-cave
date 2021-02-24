import React, { useContext, useEffect } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';
import { parseISO } from 'date-fns';
import PFP from '../assets/defaultPFP.jpg';

import { AuthContext } from '../context/auth';

const Profile = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {}, [user]);

  return (
    <Card>
      <Image src={user.imgUrl || PFP} />
      <Card.Content>
        <Card.Header>{user.username}</Card.Header>
        <Card.Meta>
          <span>Joined on {parseISO(user.createdAt).toDateString()}</span>
        </Card.Meta>
        <Card.Description></Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Icon name='user' />
      </Card.Content>
    </Card>
  );
};

export default Profile;
