import { gql } from "apollo-server-express";

export default gql`
    #extend por agora haver varias definições de query nos diferentes dominios
    extend type Query {
        users: [User!]
        user(id: ID!): User
        me: User
    }

    extend type Mutation {
        signUp(
            username: String!
            email: String!
            password: String!
        ): Token!
        
        signIn(
            login: String!, password: String!
        ): Token!
    }

    type Token {
        token: String!
    }

    type User {
        id: ID!
        username: String!
        firstname: String!
        lastname: String!
        fullname: String!
        email: String!
        messages: [Message!]
    }
`;