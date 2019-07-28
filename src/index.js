import "dotenv/config";
console.log(process.env.MY_SECRET);

import cors from "cors";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

const app = express();

app.use(cors());

let users = {
    1: {
        id: "1",
        firstname: "Joao",
        lastname: "Franco",
    },
    2: {
        id: "2",
        firstname: "Billy",
        lastname: "Bob",
    }
}

const typeDefs = gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]
    }

    type User {
        id: ID!
        username: String!
        firstname: String!
        lastname: String!
    }
`;

const resolvers  = {
    Query: {
        me: (parent, args, {me}) => {
            return me;
        },
        user: (parent, {id}) => {
            return users[id];
        },
        users: () => {
            return Object.values(users);
        },
    },
    User: {
        //resolver para type User
        //o data source nao possui username, mas graphql disponibiliza
        username: (user) => `${user.firstname} ${user.lastname}`,
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:{
        me: users[1],
    },
});

server.applyMiddleware({
    app,
    path: "/graphql"
});

app.listen({port:8000}, ()=>{
    console.log("Apollo Server on http://localhost:8000/graphql");
});