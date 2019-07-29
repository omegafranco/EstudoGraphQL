import jwt from "jsonwebtoken";
import { UserInputError, AuthenticationError } from "apollo-server-core";

const createToken = async (user, secret, expiresIn) => {
    const { id, email, username } = user;
    return await jwt.sign({ id, email, username }, secret, { expiresIn });
}
export default {
    Query: {
        users: async (parent, args, { models }) => {
            return await models.User.findAll();
        },
        user: async (parent, { id }, { models }) => {
            return await models.User.findByPk(id);
        },
        me: async (parent, args, { me, models }) => {
            if (!me) {
                return null;
            }
            return await models.User.findByPk(me.id);
        },
    },
    Mutation: {
        signUp: async (
            parent,
            { username, email, password },
            { models, secret }) => {
            const user = await models.User.create({
                username, email, password,
            });

            return { token: createToken(user, secret, "30m") };
        },
        signIn: async (
            parent,
            { login, password },
            { models, secret }) => {
            const user = await models.User.findByLogin(login);
            if (!user) {
                throw new UserInputError("Nenhum usuário encontrado para as credencias fornecidas.");
            }
            const isValid = await user.validatePassword(password);
            if (!isValid) {
                throw new AuthenticationError("Password inválida.");
            }
            return { token: createToken(user, secret, "30m") };
        },
    },
    User: {
        //resolver para type User
        //o data source nao possui username, mas graphql disponibiliza
        fullname: (user) => `${user.firstname} ${user.lastname}`,
        //data source array de messageid que precisa ser resolvido para mensagens
        messages: async (user, args, { models }) => {
            return await models.Message.findAll({
                where: { userId: user.id },
            });
        },
    },
};