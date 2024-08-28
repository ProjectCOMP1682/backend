import db from "../models/index";
import CommonUtils from '../utils/CommonUtils';

const { Op, and } = require("sequelize");
let caculateMatchCv = async(file,mapRequired) => {
    let myMapRequired = new Map(mapRequired)
    if (myMapRequired.size === 0) {
        return 0
    }
    let match = 0
    let cvData = await CommonUtils.pdfToString(file)
    cvData = cvData.pages
    cvData.forEach(item=> {
        item.content.forEach(data => {
            for (let key of myMapRequired.keys()) {
                if(CommonUtils.flatAllString(data.str).includes(CommonUtils.flatAllString(myMapRequired.get(key)))) {
                    myMapRequired.delete(key)
                    match++
                }
            }
        })
    })
    return match
}
let getMapRequiredSkill = (mapRequired,post) => {
    for (let key of mapRequired.keys()) {
        if(!CommonUtils.flatAllString(post.postDetailData.descriptionHTML).includes(CommonUtils.flatAllString(mapRequired.get(key).toLowerCase()))) {
            mapRequired.delete(key)
        }
    }
}
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
let getAllListCvByPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.postId || !data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let cv = await db.Cv.findAndCountAll({
                    where: { postId: data.postId },
                    limit: +data.limit,
                    offset: +data.offset,
                    nest: true,
                    raw: true,
                    include: [
                        {
                            model: db.User, as: 'userCvData', attributes: {
                                exclude: ['userId', 'file', 'companyId']
                            },
                            include: [
                                {
                                    model: db.Account, as: 'userAccountData', attributes: {
                                        exclude: ['password']
                                    }
                                }
                            ]
                        }
                    ]
                })
                let postInfo = await db.Post.findOne({
                    where: {id:data.postId},
                    include: [
                        {
                            model: db.DetailPost, as: 'postDetailData', attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown', 'amount'],
                            include: [
                                { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] }
                            ]
                        }
                    ],
                    raw: true,
                    nest: true
                })
                let listSkills = await db.Skill.findAll({
                    where: {categoryJobCode: postInfo.postDetailData.jobTypePostData.code}
                })
                let mapRequired = new Map()
                listSkills = listSkills.map(item => {
                    mapRequired.set(item.id,item.name)
                })
                console.log(mapRequired)
                getMapRequiredSkill(mapRequired,postInfo)
                for (let i= 0; i< cv.rows.length; i++) {
                    let match = await caculateMatchCv(cv.rows[i].file,mapRequired)
                    cv.rows[i].file = Math.round((match/mapRequired.size + Number.EPSILON) * 100) + '%'
                }
                resolve({
                    errCode: 0,
                    data: cv.rows,
                    count: cv.count,
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleCreateCv: handleCreateCv,
    getAllListCvByPost: getAllListCvByPost,

}