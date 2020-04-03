import gql from 'graphql-tag';

const typeDefs = gql`
  directive @auth(roles: [String]) on FIELD | FIELD_DEFINITION

  scalar Date

  type Query {
    hello: String @auth
    GET_USERS: [User!] @auth
    GET_REFRESH_TOKEN: User @auth
  }

  type Mutation {
    CREATE_USER(email: String!, password: String!, firstname: String!, surname: String): User!
    LOGIN(email: String!, password: String!): User
  }

  type User {
    id: ID
    firstname: String!
    surname: String!
    email: String!
    createdAt: Date
    updatedAt: Date     
  }

  type Task {
    id: ID
    title: String!
    description: String
    category: ID!
    type: ID!
    comments: [String]
    assignedTo: ID! 
    priority: ID!
    dueAt: Date!
    createdBy: ID! 
    createdAt: Date
    updatedAt: Date  
  }

  type category  {
    id: ID
    name: String!  
  }

  type taskType {
    id: ID
    name: String!
    category: ID!  
  }

`

export default typeDefs;