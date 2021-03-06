import { combineResolvers } from "graphql-resolvers";

import { isAuthenticated, isMessageOwner } from "./authorization";

export default {
    Query: {
        messages: async (parent, args, { models }) => {
            return await models.Message.findAll();
        },
        message: async (parent, { id }, { models }) => {
            return await models.Message.findByPk(id);
        }
    },
    Mutation: {
        createMessage: combineResolvers(
            isAuthenticated,
            async (parent, { text }, { me, models }) => {
                try{
                    return await models.Message.create({
                        text,
                        userId: me.id,
                    });
                } catch (error) {
                    throw new Error (error);
                }
    
            },
        ), 
        //object destructuring para remover mensagens
        deleteMessage: combineResolvers(
            isAuthenticated,
            isMessageOwner,
            async (parent, { id }, { models }) => {
                return await models.Message.destroy({
                    where: { id }
                });
            },
        ),

        updateMessage: combineResolvers(
            isAuthenticated,
            isMessageOwner,
            async (parent, { id, text }, { models }) => {
                const result =  await models.Message.update(
                    { text },
                    {
                        where: { id },
                        returning: true,
                        plain: true
                    }
                );
                console.log(result[1]);
                return result[1];
                //O conteudo retorna com o flag true
                //Posicao 0 é o numero de colunas afetadas
                //Posicao 1 a coluna afetada
            }
        ),
    },
    Message: {
        //Resolvendo User na mensagem
        user: async (message, args, { models }) => {
            return await models.User.findByPk(message.userId);
        }
    }
};