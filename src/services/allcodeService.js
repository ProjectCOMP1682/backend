import express from "express";
import db from "../models/index";
const cloudinary = require('../utils/cloudinary');
const { Op, and } = require("sequelize");
let handleCreateNewAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.value || !data.code) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let res = await db.Allcode.findOne({
                    where: { code: data.code }
                })

                if (res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Mã code đã tồn tại !'
                    })
                } else {
                    let imageUrl = ""
                    if (data.image) {
                        const uploadedResponse = await cloudinary.uploader.upload(data.image, {
                            upload_preset: 'dev_setups'
                        })
                        imageUrl = uploadedResponse.url
                    }
                    await db.Allcode.create({
                        type: data.type,
                        value: data.value,
                        code: data.code,
                        image: imageUrl
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleUpdateAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.value || !data.code) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let res = await db.Allcode.findOne({
                    where: {
                        code: data.code
                    },
                    raw: false
                })
                if (res) {
                    let imageUrl = ""
                    if (data.image) {
                        const uploadedResponse = await cloudinary.uploader.upload(data.image, {
                            upload_preset: 'dev_setups'
                        })
                        imageUrl = uploadedResponse.url
                        res.image = imageUrl
                    }
                    res.value = data.value
                    res.code = data.code
                    res = await res.save();
                    if (res)
                        resolve({
                            errCode: 0,
                            errMessage: 'Đã chỉnh sửa thành công'
                        })
                    else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Có lỗi trong quá trình chỉnh sửa'
                        })
                    }
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tồn tại code'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleCreateNewAllCode: handleCreateNewAllCode,
    handleUpdateAllCode: handleUpdateAllCode,

}