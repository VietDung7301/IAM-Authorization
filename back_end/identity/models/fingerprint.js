const { DataTypes } = require('sequelize');

const modelConfig = {
    name: 'Fingerprint',
    attributes: {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        fingerprint_1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fingerprint_2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fingerprint_3: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fingerprint_4: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        fingerprint_5: {
            type: DataTypes.STRING,
            allowNull: true,
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