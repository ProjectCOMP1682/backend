const { Op, and, where } = require("sequelize");
import e from "express";
import db from "../models/index";
const cloudinary = require('../utils/cloudinary');
require('dotenv').config();

let checkCompany = (name, id = null) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!name) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let company = null
                if (id) {
                    company = await db.Company.findOne({
                        where: { name: name, id: { [Op.ne]: id } }
                    })
                }
                else {
                    company = await db.Company.findOne({
                        where: { name: name }
                    })
                }
                if (company) {
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


let handleCreateNewCompany = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve({
                errCode: 2,
                errMessage: 'Tên công ty đã tồn tại'
            })
            if (!data.name || !data.phonenumber || !data.address
                || !data.descriptionHTML || !data.descriptionMarkdown
                || !data.amountEmployer || !data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                if (await checkCompany(data.name)) {
                }
                else {
                    let thumbnailUrl = ""
                    let coverimageUrl = ""
                    if (data.thumbnail && data.coverimage) {

                        const uploadedThumbnailResponse = await cloudinary.uploader.upload(data.thumbnail, {
                            upload_preset: 'dev_setups'
                        })
                        const uploadedCoverImageResponse = await cloudinary.uploader.upload(data.coverimage, {
                            upload_preset: 'dev_setups'
                        })
                        thumbnailUrl = uploadedThumbnailResponse.url
                        coverimageUrl = uploadedCoverImageResponse.url
                    }


                    let company = await db.Company.create({
                        name: data.name,
                        thumbnail: thumbnailUrl,
                        coverimage: coverimageUrl,
                        descriptionHTML: data.descriptionHTML,
                        descriptionMarkdown: data.descriptionMarkdown,
                        website: data.website,
                        address: data.address,
                        phonenumber: data.phonenumber,
                        amountEmployer: data.amountEmployer,
                        taxnumber: data.taxnumber,
                        statusCode: 'S1',
                        userId: data.userId,
                        censorCode: data.file ? 'CS3' : 'CS2',
                        file: data.file ? data.file : null
                    })
                    let user = await db.User.findOne({
                        where: { id: data.userId },
                        raw: false,
                        attributes: {
                            exclude: ['userId']
                        }
                    })

                    let account = await db.Account.findOne({
                        where: { userId: data.userId },
                        raw: false
                    })

                    if (user && account) {
                        user.companyId = company.id
                        await user.save()
                        account.roleCode = 'COMPANY'
                        await account.save()
                        resolve({
                            errCode: 0,
                            errMessage: 'Đã tạo công ty thành công',
                            companyId : company.id
                        })
                    }
                    else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Không tìm thấy người dùng'
                        })
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleUpdateCompany = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.name || !data.phonenumber || !data.address || !data.descriptionHTML || !data.descriptionMarkdown || !data.amountEmployer) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                if (await checkCompany(data.name, data.id)) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tên công ty đã tồn tại'
                    })
                }
                else {

                    let res = await db.Company.findOne({
                        where: {
                            id: data.id
                        },
                        raw: false
                    })
                    if (res) {
                        if (res.statusCode == "S1") {
                            if (data.thumbnail) {
                                let thumbnailUrl = ""
                                const uploadedThumbnailResponse = await cloudinary.uploader.upload(data.thumbnail, {
                                    upload_preset: 'dev_setups'
                                })
                                thumbnailUrl = uploadedThumbnailResponse.url
                                res.thumbnail = thumbnailUrl
                            }
                            if (data.coverimage) {
                                let coverImageUrl = ""
                                const uploadedcoverImageResponse = await cloudinary.uploader.upload(data.coverimage, {
                                    upload_preset: 'dev_setups'
                                })
                                coverImageUrl = uploadedcoverImageResponse.url
                                res.coverimage = coverImageUrl
                            }
                            res.name = data.name
                            res.descriptionHTML = data.descriptionHTML
                            res.descriptionMarkdown = data.descriptionMarkdown
                            res.website = data.website
                            res.address = data.address
                            res.amountEmployer = data.amountEmployer
                            res.taxnumber = data.taxnumber
                            res.phonenumber = data.phonenumber
                            if (data.file) {
                                res.file = data.file
                                res.censorCode = 'CS3'
                            }
                            else if (res.file){
                                res.censorCode = 'CS3'
                            }
                            else {
                                res.censorCode = 'CS2'
                            }
                            await res.save();
                            resolve({
                                errCode: 0,
                                errMessage: 'Đã sửa thông tin công ty thành công'
                            })
                        }
                        else {
                            resolve({
                                errCode: 2,
                                errMessage: 'Công ty bạn đã bị chặn không thể thay đổi thông tin'
                            })
                        }
                    }
                    else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Không tìm thấy công ty'
                        })
                    }
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleCreateNewCompany: handleCreateNewCompany,
    handleUpdateCompany: handleUpdateCompany,

}