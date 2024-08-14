import companyService from '../services/companyService';

let handleCreateNewCompany = async (req, res) => {
    try {
        let data = await companyService.handleCreateNewCompany(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleUpdateCompany = async (req, res) => {
    try {
        let data = await companyService.handleUpdateCompany(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleBanCompany = async (req, res) => {
    try {
        let data = await companyService.handleBanCompany(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleUnBanCompany = async (req, res) => {
    try {
        let data = await companyService.handleUnBanCompany(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleAccecptCompany = async (req, res) => {
    try {
        let data = await companyService.handleAccecptCompany(req.body);
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
    handleCreateNewCompany: handleCreateNewCompany,
    handleUpdateCompany: handleUpdateCompany,
    handleBanCompany: handleBanCompany,
    handleUnBanCompany: handleUnBanCompany,
    handleAccecptCompany : handleAccecptCompany

}