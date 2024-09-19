import packageService from '../services/packagePostService';


let creatNewPackagePost = async (req, res) => {
    try {
        let data = await packageService.creatNewPackagePost(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let updatePackagePost = async (req, res) => {
    try {
        let data = await packageService.updatePackagePost(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllPackage = async (req, res) => {
    try {
        let data = await packageService.getAllPackage(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}



let setActiveTypePackage = async (req, res) => {
    try {
        let data = await packageService.setActiveTypePackage(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}



module.exports = {
    creatNewPackagePost: creatNewPackagePost,
    updatePackagePost: updatePackagePost,
    getAllPackage: getAllPackage,
    setActiveTypePackage: setActiveTypePackage,
}