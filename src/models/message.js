const message = (sequelize, DataType) => {
    const Message = sequelize.define("message", {
        text: {
            type: DataType.STRING,
        }
    });
    Message.associate = models => {
        Message.belongsTo(models.User);
    }
    return Message;
}

export default message;