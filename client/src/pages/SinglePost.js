import React, { useContext, useEffect, useRef, useState } from 'react';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Popup,
} from 'semantic-ui-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

import { AuthContext } from '../context/auth';
import { GET_AUTHOR_PFP } from '../util/graphql';
import DeleteButton from '../components/DeleteButton';
import LikeButton from '../components/LikeButton';
import PFP from '../assets/defaultPFP.jpg';

const SinglePost = (props) => {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);
  const [authorUsername, setAuthorUsername] = useState(null);
  const [comment, setComment] = useState('');

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
    onCompleted: () => {
      setAuthorUsername(getPost.username);
      getPFP({
        variables: {
          username: getPost.username,
        },
      });
    },
  });

  const [getPFP, { data: { getAuthorPFP } = {} }] = useLazyQuery(
    GET_AUTHOR_PFP
  );

  useEffect(() => {}, [authorUsername]);

  const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    props.history.push('/');
  }
  let postUI;

  if (!getPost) {
    postUI = <p> Loading post...</p>;
  } else {
    const {
      body,
      createdAt,
      commentCount,
      comments,
      id,
      likeCount,
      likes,
      username,
    } = getPost;
    postUI = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src={getAuthorPFP ? getAuthorPFP : PFP}
              size='small'
              float='right'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>
                  {formatDistanceToNow(parseISO(createdAt), {
                    addSuffix: true,
                  })}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button as='div' labelPosition='right'>
                  <Button basic color='violet'>
                    <Icon name='comments' />
                  </Button>
                  <Label basic color='violet' pointing='left'>
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Create a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='Create a comment here!'
                        name='comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <Popup
                        content='Submit comment'
                        inverted
                        trigger={
                          <button
                            type='submit'
                            className='ui button purple'
                            disabled={comment.trim() === ''}
                            onClick={submitComment}
                          >
                            Submit
                          </button>
                        }
                      />
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => {
              return (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>
                      {formatDistanceToNow(parseISO(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              );
            })}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postUI;
};

const CREATE_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body

      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
