'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Allcode extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

    

            //account
            Allcode.hasMany(models.Account, { foreignKey: 'roleCode', as: 'roleData' })
            Allcode.hasMany(models.Account, { foreignKey: 'statusCode', as: 'statusAccountData' })

            // //user
            Allcode.hasMany(models.User, { foreignKey: 'genderCode', as: 'genderData' })


        }
    };
    Allcode.init({
        type: DataTypes.STRING,
        value: DataTypes.STRING,
        code: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        image: DataTypes.STRING
    }, 
    {
        sequelize,
        modelName: 'Allcode',
        timestamps: false,
    });
    Allcode.removeAttribute('id')
    return Allcode;
};