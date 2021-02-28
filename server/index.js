const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const app = require('express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

//Instance of Server is created
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

server.applyMiddleware({
  path: '/',
  app,
});
//Mongoose connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to mongoDB 🥳');
    //Apollo server connection
    return server
      .listen({ port: PORT })
      .then((res) => {
        console.log(`Server running at ${res.url}`);
      })
      .catch((err) => {
        console.error(err);
      });
  })
  .catch((err) => {
    console.error(err);
  });
