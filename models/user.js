const { DataTypes } = require('sequelize');

const modelConfig = {
    name: 'User',
    attributes: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        client_secret: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        redirect_uri: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        client_type: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }
}

module.exports = { modelConfig }