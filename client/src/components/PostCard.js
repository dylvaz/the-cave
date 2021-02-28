import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button, Card, Icon, Image, Label, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import PFP from '../assets/defaultPFP.jpg';
import { GET_AUTHOR_PFP } from '../util/graphql';

const PostCard = ({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(GET_AUTHOR_PFP, {
    variables: {
      username,
    },
    pollInterval: 500,
  });

  return (
    !loading && (
      <Card fluid>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src={data ? data.getAuthorPFP : PFP}
          />
          <Card.Header>{username}</Card.Header>
          <Card.Meta as={Link} to={`posts/${id}`}>
            {formatDistanceToNow(parseISO(createdAt), { addSuffix: true })}
          </Card.Meta>
          <Card.Description>{body}</Card.Description>
        </Card.Content>
        <Card.Content>
          <LikeButton user={user} post={{ id, likes, likeCount }} />
          <Popup
            content='Comment on this post.'
            inverted
            trigger={
              <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                <Button color='violet' basic>
                  <Icon name='comments' />
                </Button>
                <Label basic color='violet' pointing='left'>
                  {commentCount}
                </Label>
              </Button>
            }
          />
          {user && user.username === username && <DeleteButton postId={id} />}
        </Card.Content>
      </Card>
    )
  );
};

export default PostCard;
