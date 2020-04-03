import { ApolloClient, ApolloLink, from, HttpLink, InMemoryCache} from '@apollo/client';
import { onError } from '@apollo/link-error';
import { setContext } from '@apollo/link-context';
import fetch from 'isomorphic-unfetch';
import cookie from 'cookie';
import Router from 'next/router';

let globalApolloClient = null;

export const createApolloClient = (initialState, ctx) =>  {
    // The `ctx` (NextPageContext) will only be present on the server.
    // use it to extract auth headers (ctx.req) or similar.
    const cookies = [];

    const customFetch = (uri, options) => {
      if (ctx) {
        const headers = {
          ...options.headers,
          'cookie': ctx.req.headers.cookie,
        } 
        
        
        return fetch(uri, {
          ...options,
          headers,
        }).then(response => {
          const responseCookies = response.headers.get('set-cookie');

          if (responseCookies) {
            ctx.res.setHeader('Set-cookie', responseCookies.split(', '));
          }

          return response;
        })
      }

      return fetch(uri, options);
      
    }


    const httpLink = new HttpLink({
      uri: 'http://localhost:3000/api/graphql', // Server URL (must be absolute)
      credentials: 'include',
      fetch: customFetch , 
    });
    


    const redirectLink = onError(({ networkError, graphQLErrors }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          switch (err.extensions.code) {            
            case 'UNAUTHENTICATED':
              // redirect
              if (typeof window !== 'undefined') {
                Router.push('/login');
              }
          }
        }
      }
    });


    const client = new ApolloClient({
      ssrMode: false,
      link: from([redirectLink, httpLink]),
      cache: new InMemoryCache().restore(initialState),
  });

    // server side only
    if (ctx) {
      return {
        client,
        cookies
      }
    }
  
    return client;
  }

export const initApolloClient = (initialState, ctx) => {
    // Make sure to create a new client for every server-side request so that data
    // isn't shared between connections (which would be bad)
    if (typeof window === 'undefined') {
      return createApolloClient(initialState, ctx)
    }

    // Reuse client on the client-side
    if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState, ctx)
    }

    return globalApolloClient;
}