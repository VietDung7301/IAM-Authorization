const { DataTypes } = require('sequelize')

const modelConfig = {
    name: 'Role',
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
    }, 
    associations: [
        {
            relation: 'belongsToMany',
            target: 'Scope',
            options: { through: 'role_scope' },
        },
    ]
}

module.exports = { modelConfig }
