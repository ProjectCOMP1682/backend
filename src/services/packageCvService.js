import db from "../models/index";
const { Op, and } = require("sequelize");
require('dotenv').config();


let creatNewPackageCv = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.price || !data.value) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let packageCv = await db.PackageCv.create({
                    name: data.name,
                    value: data.value,
                    price: data.price,
                    isActive: 1
                })
                if (packageCv) {
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

let updatePackageCv = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.price || !data.value || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let packageCv = await db.PackageCv.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (packageCv) {
                    packageCv.name = data.name
                    packageCv.price = data.price
                    packageCv.value = data.value
                    await packageCv.save()
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
                if (data.search) {
                    objectFilter.where = {name: {[Op.like]: `%${data.search}%`}}
                }
                let packageCvs = await db.PackageCv.findAndCountAll(objectFilter)
                resolve({
                    errCode: 0,
                    data: packageCvs.rows,
                    count: packageCvs.count
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
                let packageCv = await db.PackageCv.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (!packageCv) {
                    resolve({
                        errCode: 2,
                        errMessage: `Product package does not exist`
                    })
                }
                else {
                    packageCv.isActive = data.isActive
                    await packageCv.save()
                    resolve({
                        errCode: 0,
                        errMessage: data.isActive == 0 ? `Product Package Deactivated` : `Product Package Active`
                    })

                }
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
                let packageCvs = await db.PackageCv.findOne({
                    where: { id: data.id }
                })
                if (packageCvs) {
                    resolve({
                        errCode: 0,
                        data: packageCvs
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Product package data not found'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getAllToSelect = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let packageCvs = await db.PackageCv.findAll()
            resolve({
                errCode: 0,
                data: packageCvs
            })
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
getAllPackage, setActiveTypePackage,creatNewPackageCv, updatePackageCv, getPackageById, getAllToSelect,
}