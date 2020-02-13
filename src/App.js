import './App.css';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import StoreProvider from './tools/ReduxReducers'
import client from './tools/apollo'
//components
import Root from './pages/index';

const App = () => {

  return (
    <StoreProvider>
      <ApolloProvider client={client}>
        <Root />
      </ApolloProvider>
    </StoreProvider>

  )

}

export default App;
