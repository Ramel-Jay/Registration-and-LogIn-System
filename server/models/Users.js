module.exports = ( sequelize, DataType ) => {
    const Users = sequelize.define( "Users", {
        firstName: {
            type: DataType.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataType.STRING,
            allowNull: false,
        },
        gender: {
            type: DataType.STRING,
            allowNull: false,
        },
        email: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
        },
        phoneNumber: {
            type: DataType.BIGINT,
            allowNull: false,
            unique: true,
        },
        avatar: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataType.STRING,
            allowNull: false,
            unique: true,
        },
    });
    return Users;
};