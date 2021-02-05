import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Button, Form } from 'semantic-ui-react';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { Redirect } from 'react-router-dom';

const CreatePost = () => {
  const [userError, setUserError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: ''
  });

  useEffect(() => {
    setRedirect(false);
  }, [redirect]);
  
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    variables: values,
    update(proxy, res) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [res.data.createPost, ...data.getPosts]
        }
      });
      values.body = '';
      setUserError(false);
      setRedirect(true);
    },
    onError(err) {
      setUserError(true);
      return err;
    },
  });

  function createPostCallback() {
    createPost();
  };


  return (redirect ?
    <Redirect to='/' />
    :
    < div className={loading ? 'loading' : ''}>
      <Form onSubmit={onSubmit}>
        <h2 className="page-title">Create a Post ✍️</h2>
        <Form.TextArea
          placeholder='Write your post here!'
          name='body'
          onChange={onChange}
          value={values.body}
          error={userError ? true : false}
        />
        <Button type='submit' color='purple'>
          Create Post
          </Button>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </div>
  );
};


const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
      likes {
        id
        username
        createdAt
      }
      likeCount
    }
  }
`;

export default CreatePost;
