import db from "../models/index";
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");
import CommonUtils from '../utils/CommonUtils';

const cloudinary = require('../utils/cloudinary');
const salt = bcrypt.genSaltSync(10);
require('dotenv').config();
let nodemailer = require('nodemailer');
let sendmail = (note, userMail, link = null) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });

    let mailOptions = {
        from: '"FIND JOB" <process.env.EMAIL_APP>',
        to: userMail,
        subject: 'Thông báo từ trang Job Finder',
        html: note
    };
    if (link)
    {
        mailOptions.html = note + ` xem thông tin <a href='${process.env.URL_REACT}/${link}'>Tại đây</a> `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message)
        } else {
        }
    });
}
let hashUserPasswordFromBcrypt = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error)
        }
    })
}
let checkUserPhone = (userPhone) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userPhone) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let account = await db.Account.findOne({
                    where: { phonenumber: userPhone }
                })
                if (account) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }


        } catch (error) {
            reject(error)
        }
    })
}
let handleCreateNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.phonenumber || !data.lastName || !data.firstName ) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let check = await checkUserPhone(data.phonenumber);
                if (check) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Số điện thoại đã tồn tại !'
                    })
                } else {
                    let imageUrl = ""
                    let isHavePass = true
                    if (!data.password) {
                        data.password = `${new Date().getTime().toString()}`
                        isHavePass = false
                    }
                    let hashPassword = await hashUserPasswordFromBcrypt(data.password);
                    if (data.image) {
                        const uploadedResponse = await cloudinary.uploader.upload(data.image, {
                            upload_preset: 'dev_setups'
                        })
                        imageUrl = uploadedResponse.url
                    }
                    if (!data.email) {
                        data.email = 'duongvanthanhson5@gmail.com'
                    }
                    let params = {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        address: data.address,
                        genderCode: data.genderCode,
                        image: imageUrl,
                        dob: data.dob,
                        companyId: data.companyId,
                        email: data.email
                    }
                    if (data.companyId){
                        params.companyId = data.companyId
                    }
                    let user = await db.User.create(params)
                    if (user)
                    {
                        await db.Account.create({
                            phonenumber: data.phonenumber,
                            password: hashPassword,
                            roleCode: data.roleCode,
                            statusCode: 'S1',
                            userId: user.id
                        })
                    }
                    if (!isHavePass) {
                        let note = `<h3>Tài khoản đã tạo thành công</h3>
                                    <p>Tài khoản: ${data.phonenumber}</p>
                                    <p>Mật khẩu: ${data.password}</p>
                        `
                        sendmail(note,data.email)                        
                    }
                    resolve({
                        errCode: 0,
                        message: 'Tạo tài khoản thành công'
                    })
                }

            }

        } catch (error) {
            reject(error.message)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: `Missing required parameters`
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.id },
                    raw: false,
                    attributes: {
                        exclude: ['userId']
                    }
                })
                let account = await db.Account.findOne({
                    where: {userId: data.id},
                    raw:false
                })
                if (user && account) {
                    user.firstName = data.firstName
                    user.lastName = data.lastName
                    user.address = data.address
                    user.genderCode = data.genderCode
                    user.dob = data.dob
                    user.email = data.email
                    if (data.image) {
                        let imageUrl = ""
                        const uploadedResponse = await cloudinary.uploader.upload(data.image, {
                            upload_preset: 'dev_setups'
                        })
                        imageUrl = uploadedResponse.url
                        user.image = imageUrl
                    }
                    await user.save();
                    if (data.roleCode)
                    account.roleCode = data.roleCode
                    await account.save();
                    let temp = {
                        address: user.address,
                        companyId: user.companyId,
                        dob: user.dob,
                        email: user.email,
                        firstName: user.firstName,
                        genderCode: user.genderCode,
                        id: user.id,
                        image: user.image,
                        lastName: user.lastName,
                        roleCode: account.roleCode
                    }
                    delete temp.file
                    resolve({
                        errCode: 0,
                        message: 'Đã chỉnh sửa thành công',
                        user: temp
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'User not found!'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let banUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {

                let foundUser = await db.User.findOne({
                    where: { id: data.id },
                    attributes: {
                        exclude: ['userId']
                    }
                })
                if (!foundUser) {
                    resolve({
                        errCode: 2,
                        errMessage: `Người dùng không tồn tại`
                    })
                }
                else{
                    let account = await db.Account.findOne({
                        where: {userId: data.id},
                        raw: false
                    })
                    if (account)
                    {
                        account.statusCode = 'S2'
                        await account.save()
                        resolve({
                            errCode: 0,
                            message: `Người dùng đã ngừng kích hoạt`
                        })
                    }
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}

let unbanUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundUser = await db.User.findOne({
                    where: { id: data.id },
                    attributes: {
                        exclude: ['userId']
                    }
                })
                if (!foundUser) {
                    resolve({
                        errCode: 2,
                        errMessage: `Người dùng không tồn tại`
                    })
                }
                else{
                    let account = await db.Account.findOne({
                        where: {userId: data.id},
                        raw: false
                    })
                    if (account)
                    {
                        account.statusCode = 'S1'
                        await account.save()
                        resolve({
                            errCode: 0,
                            message: `Người dùng đã kích hoạt`
                        })
                    }
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.phonenumber || !data.password) {
                resolve({
                    errCode: 4,
                    errMessage: 'Missing required parameters!'
                })
            }
            else {
                let userData = {};

                let isExist = await checkUserPhone(data.phonenumber);

                if (isExist) {
                    let account = await db.Account.findOne({
                        where: { phonenumber: data.phonenumber },
                        raw: true
                    })
                    if (account) {
                        let check = await bcrypt.compareSync(data.password, account.password);
                        if (check) {
                            if (account.statusCode == 'S1')
                            {
                                let user = await db.User.findOne({
                                    attributes: {
                                        exclude: ['userId','file']
                                    },
                                    where: {id: account.userId  },
                                    raw: true
                                })
                                user.roleCode = account.roleCode
                                userData.errMessage = 'Ok';
                                userData.errCode = 0;
                                userData.user= user;
                                userData.token = CommonUtils.encodeToken(user.id)
                            }
                            else {
                                userData.errCode = 1;
                                userData.errMessage = 'Tài khoản của bạn đã bị khóa';
                            }
                        }
                        else {
                            userData.errCode = 2;
                            userData.errMessage = 'Số điện thoại hoặc mật khẩu không chính xác';
                        }
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'User not found!'
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `Số điện thoại hoặc mật khẩu không chính xác`
                }
                resolve(userData)
            }


        } catch (error) {
            reject(error)
        }
    })
}
let handleChangePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.password || !data.oldpassword) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let account = await db.Account.findOne({
                    where: { userId: data.id },
                    raw: false
                })
                if (await bcrypt.compareSync(data.oldpassword, account.password)) {
                    if (account) {
                        account.password = await hashUserPasswordFromBcrypt(data.password);
                        await account.save();
                    }
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Mật khẩu cũ không chính xác'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let changePaswordByPhone = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let account = await db.Account.findOne({
                where: { phonenumber: data.phonenumber },
                raw: false
            })
            if (account) {
                account.password = await hashUserPasswordFromBcrypt(data.password);
                await account.save();
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
            else {
                resolve({
                    errCode:1,
                    errMessage: 'SĐT không tồn tại'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleCreateNewUser: handleCreateNewUser,
    updateUserData: updateUserData,
    checkUserPhone: checkUserPhone,
    banUser: banUser,
    unbanUser: unbanUser,
    handleLogin: handleLogin,
    handleChangePassword: handleChangePassword,
    changePaswordByPhone: changePaswordByPhone,

}