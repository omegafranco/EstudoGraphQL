const user = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        firstname: {
            type: DataTypes.STRING,
        },
        lastname: {
            type: DataTypes.STRING
        }
    });
    User.associate = models => {
        User.hasMany(models.Message, { onDelete: "CASCADE" });
    };
    User.findByLogin = async login => {
        let user = await User.findOne({
            where: { firstname: login }
        });
        if (!user) {
            user = await User.findOne({
                where: { email: login }
            });
        }
        return user;
    }
    return User;
};

export default user;