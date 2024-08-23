import db from "../models/index";
const { Op } = require("sequelize");
require('dotenv').config();
var nodemailer = require('nodemailer');
let sendmail = (note, userMail, link = null) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_APP,
        to: userMail,
        subject: 'Notice from TOP CV page',
        html: note
    };
    if (link)
    {
        mailOptions.html = note + ` <br>
        View post information <a href='${process.env.URL_REACT}/${link}'>Here</a> `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        } else {
        }
    });
}
let handleCreateNewPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.categoryJobCode || !data.addressCode || !data.salaryJobCode || !data.amount || !data.timeEnd || !data.categoryJoblevelCode || !data.userId
                || !data.categoryWorktypeCode || !data.experienceJobCode || !data.genderPostCode || !data.descriptionHTML || !data.descriptionMarkdown || data.isHot === ''
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let user = await db.User.findOne({
                    where: { id: data.userId },
                    attributes: {
                        exclude: ['userId']
                    }
                })
                let company = await db.Company.findOne({
                    where: { id: user.companyId },
                    raw: false
                })
                if (!company) {
                    resolve({
                        errCode: 2,
                        errMessage: 'User is not affiliated with the company'
                    })
                    return
                }
                else {
                    if (company.statusCode == "S1") {
                        if (data.isHot == '1') {
                            if (company.allowHotPost > 0) {
                                company.allowHotPost -= 1
                                await company.save({silent: true})
                            }
                            else {
                                resolve({
                                    errCode: 2,
                                    errMessage: 'Your company has run out of featured posts.'
                                })
                                return
                            }
                        }
                        else {
                            if (company.allowPost > 0) {
                                company.allowPost -= 1
                                await company.save({silent: true})
                            }
                            else {
                                resolve({
                                    errCode: 2,
                                    errMessage: 'Your company has run out of normal posting times.'
                                })
                                return
                            }
                        }
                        let detailPost = await db.DetailPost.create({
                            name: data.name,
                            descriptionHTML: data.descriptionHTML,
                            descriptionMarkdown: data.descriptionMarkdown,
                            categoryJobCode: data.categoryJobCode,
                            addressCode: data.addressCode,
                            salaryJobCode: data.salaryJobCode,
                            amount: data.amount,
                            categoryJoblevelCode: data.categoryJoblevelCode,
                            categoryWorktypeCode: data.categoryWorktypeCode,
                            experienceJobCode: data.experienceJobCode,
                            genderPostCode: data.genderPostCode,
                        })
                        await db.Post.create({
                            statusCode: 'PS3',
                            timeEnd: data.timeEnd,
                            userId: data.userId,
                            isHot: data.isHot,
                            detailPostId: detailPost.id
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Successfully created job posting, please wait for admin approval'
                        })
                    }
                    else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Your company has been blocked from posting.'
                        })
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleUpdatePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.categoryJobCode || !data.addressCode || !data.salaryJobCode || !data.amount || !data.timeEnd || !data.categoryJoblevelCode
                || !data.categoryWorktypeCode || !data.experienceJobCode || !data.genderPostCode || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.id || !data.userId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let post = await db.Post.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (post) {
                    let otherPost = await db.Post.findOne({
                        where: {detailPostId: post.detailPostId,id: {
                                [Op.ne]: post.id
                            }}
                    })
                    if (otherPost) {
                        let newDetailPost = await db.DetailPost.create({
                            name: data.name,
                            descriptionHTML: data.descriptionHTML,
                            descriptionMarkdown: data.descriptionMarkdown,
                            categoryJobCode: data.categoryJobCode,
                            addressCode: data.addressCode,
                            salaryJobCode: data.salaryJobCode,
                            amount: data.amount,
                            categoryJoblevelCode: data.categoryJoblevelCode,
                            categoryWorktypeCode: data.categoryWorktypeCode,
                            experienceJobCode: data.experienceJobCode,
                            genderPostCode: data.genderPostCode,
                        })
                        post.detailPostId = newDetailPost.id
                    }
                    else {
                        let detailPost = await db.DetailPost.findOne({
                            where: {id: post.detailPostId},
                            attributes: {
                                exclude: ['statusCode']
                            },
                            raw: false
                        })
                        detailPost.name =  data.name,
                            detailPost.descriptionHTML =  data.descriptionHTML,
                            detailPost.descriptionMarkdown =  data.descriptionMarkdown,
                            detailPost.categoryJobCode =  data.categoryJobCode,
                            detailPost.addressCode =  data.addressCode,
                            detailPost.salaryJobCode =  data.salaryJobCode,
                            detailPost.amount =  data.amount,
                            detailPost.categoryJoblevelCode =  data.categoryJoblevelCode,
                            detailPost.categoryWorktypeCode =  data.categoryWorktypeCode,
                            detailPost.experienceJobCode =  data.experienceJobCode,
                            detailPost.genderPostCode =  data.genderPostCode,
                            await detailPost.save()
                    }
                    post.userId = data.userId
                    post.statusCode = 'PS3'
                    await post.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Edited post successfully, please wait for admin approval'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Post does not exist!'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleAcceptPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.statusCode) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundPost = await db.Post.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (foundPost) {
                    foundPost.statusCode = data.statusCode
                    if (data.statusCode == "PS1") {
                        foundPost.timePost = new Date().getTime()
                    }
                    await foundPost.save()
                    let note = data.statusCode == "PS1" ? "Post approved successfully" : data.note

                    let user = await db.User.findOne({
                        where: { id: foundPost.userId },
                        attributes: {
                            exclude: ['userId']
                        }
                    })
                    if (data.statusCode == "PS1")
                    {
                        sendmail(note, user.email,`detail-job/${foundPost.id}`)
                    }
                    else {
                        sendmail(`Posts #${foundPost.id} Your request has been rejected.`, user.email,`admin/list-post/${foundPost.id}`)
                    }
                    resolve({
                        errCode: 0,
                        errMessage: data.statusCode == "PS1" ? 'Post approved successfully' : 'Post rejected successfully'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'No posts exist'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleBanPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.postId || !data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundPost = await db.Post.findOne({
                    where: { id: data.postId },
                    raw: false
                })
                if (foundPost) {
                    foundPost.statusCode = 'PS4'
                    await foundPost.save()

                    let user = await db.User.findOne({
                        where: { id: foundPost.userId },
                        attributes: {
                            exclude: ['userId']
                        }
                    })
                    sendmail(`Your Posts ${foundPost.id} has been blocked `, user.email,`admin/list-post/${foundPost.id}`)

                    resolve({
                        errCode: 0,
                        errMessage: 'Post blocked successfully'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'No posts exist'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleActivePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.userId ) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundPost = await db.Post.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (foundPost) {
                    foundPost.statusCode = 'PS3'
                    await foundPost.save()

                    let user = await db.User.findOne({
                        where: { id: foundPost.userId },
                        attributes: {
                            exclude: ['userId']
                        }
                    })
                    sendmail(` Your Posts ${foundPost.id} has been actived. `, user.email,`admin/list-post/${foundPost.id}`)
                    resolve({
                        errCode: 0,
                        errMessage: 'Pending status reopened'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'No posts exist'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getListPostByAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset || !data.companyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let company = await db.Company.findOne({
                    where: { id: data.companyId }
                })
                if (!company) {
                    resolve({
                        errCode: 2,
                        errorMessage: 'The company does not exist',
                    })
                }
                else {
                    let listUserOfCompany = await db.User.findAll({
                        where: { companyId: company.id },
                        attributes: ['id'],
                    })
                    listUserOfCompany = listUserOfCompany.map(item => {
                        return {
                            userId: item.id
                        }
                    })
                    let objectFilter = {
                        where: {
                            [Op.and]: [{ [Op.or]: listUserOfCompany }]
                        },
                        order: [['updatedAt', 'DESC']],
                        limit: +data.limit,
                        offset: +data.offset,
                        attributes: {
                            exclude: ['detailPostId']
                        },
                        nest: true,
                        raw: true,
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
                            },
                            { model: db.Allcode, as: 'statusPostData', attributes: ['value', 'code'] },
                            { model: db.User, as: 'userPostData',
                                attributes: {
                                    exclude: ['userId']
                                },
                                include: [
                                    {model : db.Company, as: 'userCompanyData'}
                                ]
                            }
                        ]
                    }

                    let post = await db.Post.findAndCountAll(objectFilter)
                    resolve({
                        errCode: 0,
                        data: post.rows,
                        count: post.count
                    })
                }
            }
        } catch (error) {
            reject(error.message)
        }
    })


}
let getAllPostByAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let objectFilter = {
                    order: [['updatedAt', 'DESC']],
                    limit: +data.limit,
                    offset: +data.offset,
                    attributes: {
                        exclude: ['detailPostId']
                    },
                    nest: true,
                    raw: true,
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
                        },
                        { model: db.Allcode, as: 'statusPostData', attributes: ['value', 'code'] },
                        {
                            model: db.User, as: 'userPostData', attributes: { exclude: ['userId'] },
                            include: [
                                { model: db.Company, as: 'userCompanyData' }
                            ]
                        }
                    ],
                    order: [['updatedAt', 'DESC']],
                }


                let post = await db.Post.findAndCountAll(objectFilter)
                resolve({
                    errCode: 0,
                    data: post.rows,
                    count: post.count
                })
            }
        } catch (error) {
            reject(error.message)
        }
    })


}
module.exports = {
    handleCreateNewPost: handleCreateNewPost,
    handleUpdatePost: handleUpdatePost,
    handleAcceptPost: handleAcceptPost,
    handleBanPost: handleBanPost,
    handleActivePost: handleActivePost,
    getListPostByAdmin: getListPostByAdmin,
    getAllPostByAdmin: getAllPostByAdmin,

}