import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract',
  cache: new InMemoryCache(),
});