import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "http://localhost:7001/graphql",
  cache: new InMemoryCache(),
});

export default apolloClient;
