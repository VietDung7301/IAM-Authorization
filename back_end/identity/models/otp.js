const { DataTypes } = require('sequelize');

const modelConfig = {
    name: 'Otp',
    attributes: {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        type: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        otp: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        is_used: {
            type: DataTypes.TINYINT,
            allowNull: false,
        },
        expires: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    associations: [
        {
            relation: 'belongsTo',
            target: 'User',
            options: {
                foreignKey: 'user_id',
            },
        },
    ],
}

module.exports = { modelConfig }