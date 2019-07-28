import { gql } from "apollo-server-express";

export default gql`
    #extend por agora haver varias definições de query nos diferentes dominios
    extend type Query {
        messages: [Message!]!
        message(id: ID!): Message!
    }
    #extend por agora haver varias definições de query nos diferentes dominios
    extend type Mutation {
        createMessage(text: String!): Message!
        updateMessage(id: ID!, text: String!): Message
        deleteMessage(id: ID!): Boolean!
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }
`;