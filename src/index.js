import "dotenv/config";

import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { ApolloServer, AuthenticationError } from "apollo-server-express";1


import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";

const app = express();

app.use(cors());

const getMe = async req => {
    const token =  req.headers["x-token"];
    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET)
        } catch (e) {
            throw new AuthenticationError("Sua sessão expirou. Efetue login novamente.");
        }
    }
}
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
        //Remove a mensagem interna do sequelize
        //Deixa apenas o validation error do modelo
        const message = error.message
            .replace("SequelizeValidationError: ", "")
            .replace("Validation error: ", "");
        return {
            ...error,
            message
        }
    },
    context: async ({ req }) => {
        const me = await getMe(req);
        return {
            models,
            me,
            secret: process.env.SECRET,
        };
    }

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
            username: "omegafranco",
            email: "omegafranco@omegafranco.com",
            password: "omegafranco",
            role: "ADMIN", // potencial mudança para array com multiplos perfis
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
            username: "billybob",
            email: "billybob@billybob.com",
            password: "billybob",
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
