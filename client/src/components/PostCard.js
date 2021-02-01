import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Button, Card, Icon, Image, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const PostCard = ({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) => {

  const likePost = () => {
    console.log('likepost');
  };

  const commentOnPost = () => {
    console.log('comment on post');
  };

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`posts/${id}`}>{formatDistanceToNow(parseISO(createdAt), { addSuffix: true })}</Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content>
        <Button as='div' labelPosition='right' onClick={likePost}>
          <Button color='red' basic>
            <Icon name='heart' />
          </Button>
          <Label basic color='red' pointing='left'>
            {likeCount}
          </Label>
        </Button>
        <Button as='div' labelPosition='right' onClick={commentOnPost}>
          <Button color='violet' basic>
            <Icon name='comments' />
          </Button>
          <Label basic color='violet' pointing='left'>
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );

};

export default PostCard;
