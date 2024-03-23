const { DataTypes } = require('sequelize')

const modelConfig = {
    name: 'Permission',
    attributes: {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        accessible_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        method: {
            type: DataTypes.ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
            allowNull: false,
        },
    }, 
    associations: [
        {
            relation: 'belongsTo',
            target: 'Scope',
            options: {},
        },
    ]
}

module.exports = { modelConfig }