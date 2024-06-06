const { DataTypes } = require('sequelize');

const modelConfig = {
    name: 'LinkedAccount',
    attributes: {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sub: {
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