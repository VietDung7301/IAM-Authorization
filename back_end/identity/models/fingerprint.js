const { DataTypes } = require('sequelize');

const modelConfig = {
    name: 'Fingerprint',
    attributes: {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        fingerprints: {
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