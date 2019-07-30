import { ForbiddenError } from "apollo-server";
import { skip, combineResolvers } from "graphql-resolvers";

//Resolver level authorization: alguns resolvers necessitam login
//Pode ser implementado com directive ou field level no GraphQL
export const isAuthenticated = (parent, args, { me }) => 
    me ? skip: new ForbiddenError("Usuário não autenticado.");

//Permission based authorization: somente o proprietario pode apagar sua mensagem
export const isMessageOwner = async (
    parent,
    { id },
    { models, me }
) => {
    const message = await models.Message.findByPk(id, { raw: true});
    if ( message.userId !== me.id) {
        throw new ForbiddenError("Não autenticado como o proprietário");
    }
    return skip;
}

//Role based authorization: somente ADMIN pode apagar usuario
export const isAdmin = combineResolvers(
    isAuthenticated,
    (parent, args, { me: { role } }) => 
                role === "ADMIN" // potencial mudança para array com multiplos perfis
                ? skip
                : new ForbiddenError("Usuário não autorizado como admin.")
);