import { gql } from "apollo-server-express";

export default gql`
    #extend por agora haver varias definições de query nos diferentes dominios
    extend type Query {
        users: [User!]
        user(id: ID!): User
        me: User
    }

    type User {
        id: ID!
        username: String!
        firstname: String!
        lastname: String!
        fullname: String!
        messages: [Message!]
    }
`;