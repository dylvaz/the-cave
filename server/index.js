const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');


const Post = require('./models/Post');
require('dotenv').config();

//Schema/Type Definitions
const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post]
  }
`;

//Resolvers
const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find();
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

//Instance of Server is created
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//Mongoose connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log('Connected to mongoDB 🥳');
    //Apollo server connection
    return server.listen({ port: 5000 })
      .then(res => {
        console.log(`Server running at ${res.url}`);
      }).catch(err => {
        console.error(err);
      });
  }).catch(err => {
    console.error(err);
  });
