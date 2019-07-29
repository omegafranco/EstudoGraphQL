const message = (sequelize, DataType) => {
    const Message = sequelize.define("message", {
        text: {
            type: DataType.STRING,
            validate: {
                notEmpty: {
                    args: true,
                    msg: "Uma mensagem precisa de um texto.",
                }
            }
        }
    });
    Message.associate = models => {
        Message.belongsTo(models.User);
    }
    return Message;
}

export default message;