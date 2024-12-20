'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            //Allcode
            User.belongsTo(models.Allcode, { foreignKey: 'genderCode', targetKey: 'code', as: 'genderData' })
            //Account
            User.hasOne(models.Account, { foreignKey: 'userId', as: 'userAccountData' })
            // //Company
            User.belongsTo(models.Company, { foreignKey: 'companyId', targetKey: 'id', as: 'userCompanyData' })
            User.hasOne(models.Company, { foreignKey: 'userId', as: 'companyUserData' })
            // //Cv
            User.hasMany(models.Cv, { foreignKey: 'userId', as: 'userCvData' })
            //Post
            User.hasMany(models.Post,{foreignKey: 'userId', as: 'userPostData' })
            //Note
            User.hasMany(models.Note,{foreignKey:'userId',as:'userNoteData'})
            //UserSetting
            User.hasOne(models.UserSetting, { foreignKey: 'userId', as: 'userSettingData' })
            //UserSkill - Skill
            User.belongsToMany(models.Skill, { through: models.UserSkill});
            //OrderPackage
            User.hasMany(models.User,{foreignKey:'userId',as: 'userOrderData'})
            //OrderPackageCv
            User.hasMany(models.User,{foreignKey:'userId',as: 'userOrderCvData'})
        }
    };
    User.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: DataTypes.STRING,
        address: DataTypes.STRING,
        genderCode: DataTypes.STRING,
        image: DataTypes.STRING,
        dob: DataTypes.STRING,
        companyId: DataTypes.INTEGER,
    }, 
    {
        sequelize,
        modelName: 'User',
        timestamps: false
    });
    return User;
};