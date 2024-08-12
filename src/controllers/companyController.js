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

module.exports = {
    handleCreateNewCompany: handleCreateNewCompany,

}