const { DataTypes } = require('sequelize');

const modelConfig = {
    name: 'OTP',
    attributes: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        exp: {
            type: DataTypes.TIME,
            allowNull: false,
        },
    },
    associations: [
        {
            relation: 'belongsTo',
            target: 'User',
            options: {},
        },
    ],
}

module.exports = { modelConfig }