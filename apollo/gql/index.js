import { gql } from '@apollo/client';

export const GET_REFRESH_TOKEN = gql`
    query {
        GET_REFRESH_TOKEN {
            id
            firstname
        }
    }
`;

export const HELLO = gql`
  {
    hello 
  }
`