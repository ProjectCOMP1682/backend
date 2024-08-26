import db from "../models/index";
const { Op, and } = require("sequelize");


let handleCreateCv = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.file || !data.postId || !data.description) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let cv = await db.Cv.create({
                    userId: data.userId,
                    file: data.file,
                    postId: data.postId,
                    isChecked: 0,
                    description: data.description
                })
                if (cv) {
                    resolve({
                        errCode: 0,
                        errMessage: 'CV sent successfully'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'CV sent failed'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    handleCreateCv: handleCreateCv,
}