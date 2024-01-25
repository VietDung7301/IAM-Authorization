const { DataTypes } = require('sequelize')

const modelConfig = {
    name: 'Scope',
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
            target: 'Role',
            options: { through: 'role_scope' },
        },
        {
            relation: 'hasMany',
            target: 'Permission',
            options: {},
        },
    ]
}

module.exports = { modelConfig }