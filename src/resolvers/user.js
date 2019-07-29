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