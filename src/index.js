import "dotenv/config";
console.log(process.env.MY_SECRET);

import cors from "cors";
import express from "express";
import { ApolloServer } from "apollo-server-express";


import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();

app.use(cors());

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async () => ({
        models,
        me: await models.User.findByLogin("Joao"),
    }),
});

server.applyMiddleware({
    app,
    path: "/graphql"
});

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync })
    .then(async () => {
        if (eraseDatabaseOnSync) {
            createUsersWithMessages();
        }
        app.listen({ port: 8000 }, () => {
            console.log(`Apollo Server on http://localhost:8000/graphql`);
        });
    });

const createUsersWithMessages = async () => {
    await models.User.create(
        {
            firstname: "Joao",
            lastname: "Franco",
            messages: [
                { text: "Olá pra você." },
                { text: "Tudo bem?" },
            ],
        },
        {
            include: [models.Message],
        }
    );
    await models.User.create(
        {
            firstname: "Billy",
            lastname: "Bob",
            messages: [
                { text: "Eai" },
                { text: "Certinho" },
            ],
        },
        {
            include: [models.Message],
        }
    );
};
