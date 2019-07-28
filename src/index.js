import "dotenv/config";
console.log(process.env.MY_SECRET);

import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import uuidv4 from "uuid/v4";

const app = express();

app.use(cors());

let users = {
    1: {
        id: "1",
        firstname: "Joao",
        lastname: "Franco",
        messageIds: [1],
    },
    2: {
        id: "2",
        firstname: "Billy",
        lastname: "Bob",
        messageIds: [2],
    },
}

let messages = {
    1: {
        id: "1",
        text: "Hello World",
        userId: "1",
    },
    2: {
        id: "2",
        text: "Olá Mundo",
        userId: "2",
    },
}

const typeDefs = gql`
    type Query {
        users: [User!]
        user(id: ID!): User
        me: User

        messages: [Message!]!
        message(id: ID!): Message!
    }
    
    type Mutation {
        createMessage(text: String!): Message!
        updateMessage(id: ID!, text: String!): Message
        deleteMessage(id: ID!): Boolean!
    }

    type User {
        id: ID!
        username: String!
        firstname: String!
        lastname: String!
        messages: [Message!]
    }

    type Message {
        id: ID!
        text: String!
        user: User!
    }
`;

const resolvers = {
    Query: {
        users: () => {
            return Object.values(users);
        },
        user: (parent, { id }) => {
            return users[id];
        },
        me: (parent, args, { me }) => {
            return me;
        },
        messages: () => {
            return Object.values(messages);
        },
        message: (parent, { id }) => {
            return messages[id];
        }
    },
    Mutation: {
        createMessage: (parent, { text }, { me }) => {
            const id = uuidv4();
            const message = {
                id,
                text,
                userId: me.id,
            };
            messages[id] = message;
            users[me.id].messageIds.push(id);
            return message;
        },
        //object destructuring para remover mensagens
        deleteMessage: (parent, { id }) => {
            const { [id]: message, ...otherMessages } = messages;

            if (!message) {
                return false;
            }
            messages = otherMessages;
            return true;
        },
        updateMessage: (parent, { id, text }) => {
            const { [id]: message } = messages;

            if (!message) {
                return null;
            }
            message.text = text;
            messages[id] = message;
            return message;
        }
    },
    User: {
        //resolver para type User
        //o data source nao possui username, mas graphql disponibiliza
        username: (user) => `${user.firstname} ${user.lastname}`,
        //data source array de messageid que precisa ser resolvido para mensagens
        messages: (user) => {
            return Object.values(messages).filter(message => message.userId === user.id)
        },
    },
    Message: {
        //Mensagens são criados pelo usuário autenticado
        //user não está no data source
        user: message => {
            return users[message.userId];
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
        me: users[1],
    },
});

server.applyMiddleware({
    app,
    path: "/graphql"
});

app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
});