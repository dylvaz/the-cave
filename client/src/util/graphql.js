import { gql } from '@apollo/client';

const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
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
        body
        createdAt
      }
    }
  }
`;
const GET_AUTHOR_PFP = gql`
  query($username: String!) {
    getAuthorPFP(username: $username)
  }
`;
export { FETCH_POSTS_QUERY, GET_AUTHOR_PFP };
