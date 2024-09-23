import db from "../models/index";
const { Op, and } = require("sequelize");
require('dotenv').config();


let creatNewPackagePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.price || !data.value || data.isHot === '') {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let packagePost = await db.PackagePost.create({
                    name: data.name,
                    value: data.value,
                    isHot: data.isHot,
                    price: data.price,
                    isActive: 1
                })
                if (packagePost) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Successfully created product package'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Product package creation failed'
                    })
                }
            }
        } catch (error) {
            if (error.message.includes('Validation error')) {
                resolve({
                    errCode: 2,
                    errMessage: 'Product package name already exists'
                })
            }
            else {
                reject(error)
            }
        }
    })
}

let updatePackagePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.price || !data.value || data.isHot === '' || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let packagePost = await db.PackagePost.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (packagePost) {
                    packagePost.name = data.name
                    packagePost.price = data.price
                    packagePost.value = data.value
                    packagePost.isHot = data.isHot
                    await packagePost.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update successful'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Update failed'
                    })
                }
            }
        } catch (error) {
            if (error.message.includes('Validation error')) {
                resolve({
                    errCode: 2,
                    errMessage: 'Product package name already exists'
                })
            }
            else {
                reject(error)
            }
        }
    })
}
let getAllPackage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let objectFilter = {
                    offset: +data.offset,
                    limit: +data.limit
                }

                let packagePosts = await db.PackagePost.findAndCountAll(objectFilter)
                resolve({
                    errCode: 0,
                    data: packagePosts.rows,
                    count: packagePosts.count
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}



let setActiveTypePackage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || data.isActive === '') {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let packagePost = await db.PackagePost.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (!packagePost) {
                    resolve({
                        errCode: 2,
                        errMessage: `Product package does not exist`
                    })
                }
                else {
                    packagePost.isActive = data.isActive
                    await packagePost.save()
                    resolve({
                        errCode: 0,
                        errMessage: data.isActive == 0 ? `Package deactivated` : `Package active`
                    })

                }
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getPackageByType = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.isHot === '') {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let packagePost = await db.PackagePost.findAll({
                    where: { isHot: data.isHot }
                })
                resolve({
                    errCode: 0,
                    data: packagePost
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getPackageById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let packagePost = await db.PackagePost.findOne({
                    where: { id: data.id }
                })
                if (packagePost) {
                    resolve({
                        errCode: 0,
                        data: packagePost
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        errMessage: 'The data package product was not found'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
   getAllPackage, setActiveTypePackage,
     creatNewPackagePost, updatePackagePost, getPackageByType,  getPackageById
}