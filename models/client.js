const { DataTypes } = require('sequelize');

const modelConfig = {
    name: 'Client',
    attributes: {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        client_secret: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        redirect_uri: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        client_type: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        homepage_url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, 
    // associations: [
    //     {
    //         relation: '',
    //         target: '',
    //         options: {},
    //     },
    // ]
}

module.exports = { modelConfig }