export default {
    Query: {
        users: (parent, args, { models }) => {
            return Object.values(models.users);
        },
        user: (parent, { id }, { models }) => {
            return models.users[id];
        },
        me: (parent, args, { me }) => {
            return me;
        },
    },
    User: {
        //resolver para type User
        //o data source nao possui username, mas graphql disponibiliza
        username: (user) => `${user.firstname} ${user.lastname}`,
        //data source array de messageid que precisa ser resolvido para mensagens
        messages: (user, args, { models }) => {
            return Object.values(models.messages).filter(message => message.userId === user.id)
        },
    },
};