import './App.css';
import React from 'react';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';
//components
import Root from './pages/index';

//auth
const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await localStorage.getItem('token'); // OR GET FROM MONGODB
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Token is :  ${token}` : "",
    }
  }
});

//client set up
const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const client = new ApolloClient({
  cache,
  link: authLink.concat(link)
});




const App = ()   =>  {

    return (
      <ApolloProvider client={client}>
          <Root />
      </ApolloProvider>
    )

}

export default App;
