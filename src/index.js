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
        username: "Joao Franco"
    },
    2: {
        id: "2",
        username: "Billy Bob"
    }
}
const me = users[1];

const typeDefs = gql`
    type Query {
        me: User
        user(id: ID!): User
        users: [User!]
    }

    type User {
        id: ID!
        username: String!
    }
`;

const resolvers  = {
    Query: {
        me: () => {
            return me;
        },
        user: (parent, {id}) => {
            return users[id];
        },
        users: () => {
            return Object.values(users);
        },
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

server.applyMiddleware({
    app,
    path: "/graphql"
});

app.listen({port:8000}, ()=>{
    console.log("Apollo Server on http://localhost:8000/graphql");
});