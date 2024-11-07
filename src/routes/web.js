import express from "express";
import userController from '../controllers/userController';
import allcodeController from '../controllers/allcodeController';
import companyController from '../controllers/companyController';
import postController from '../controllers/postController';
import cvController from '../controllers/cvController'
import packageController from '../controllers/packagePostController'
import packageCvController from '../controllers/packageCvController'

import middlewareControllers from '../middlewares/jwtVerify'
let router = express.Router();

let initWebRoutes = (app) => {

    //=====================API USER==========================//
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/update-user', userController.handleUpdateUser)
    router.post('/api/ban-user' , middlewareControllers.verifyTokenAdmin,userController.handleBanUser)
    router.post('/api/unban-user', middlewareControllers.verifyTokenAdmin ,userController.handleUnbanUser)
    router.get('/api/check-phonenumber-user', userController.checkUserPhone)
    router.post('/api/login', userController.handleLogin)
    router.post('/api/changepassword', middlewareControllers.verifyTokenUser,userController.handleChangePassword)
    router.post('/api/changepasswordbyPhone', userController.changePaswordByPhone)
    router.get('/api/get-all-user', middlewareControllers.verifyTokenUser,userController.getAllUser)
    router.get('/api/get-detail-user-by-id', middlewareControllers.verifyTokenUser,userController.getDetailUserById)
    router.put('/api/setDataUserSetting', userController.setDataUserSetting)

    //===================API ALLCODE========================//
    router.post('/api/create-new-all-code',middlewareControllers.verifyTokenAdmin ,allcodeController.handleCreateNewAllCode)
    router.put('/api/update-all-code', middlewareControllers.verifyTokenAdmin,allcodeController.handleUpdateAllCode)
    router.delete('/api/delete-all-code', middlewareControllers.verifyTokenAdmin,allcodeController.handleDeleteAllCode)
    router.get('/api/get-all-code', allcodeController.getAllCodeService)
    router.get('/api/get-detail-all-code-by-code', allcodeController.getDetailAllcodeByCode)
    router.get('/api/get-list-allcode', allcodeController.getListAllCodeService)
    router.post('/api/create-new-skill',middlewareControllers.verifyTokenAdmin ,allcodeController.handleCreateNewSkill)
    router.delete('/api/delete-skill',middlewareControllers.verifyTokenAdmin ,allcodeController.handleDeleteSkill)
    router.put('/api/update-skill', middlewareControllers.verifyTokenAdmin,allcodeController.handleUpdateSkill)
    router.get('/api/get-list-skill', allcodeController.getListSkill)
    router.get('/api/get-detail-skill-by-id',middlewareControllers.verifyTokenAdmin ,allcodeController.getDetailSkillById)
    router.get('/api/get-list-job-count-post', allcodeController.getListJobTypeAndCountPost)

    //==================API COMPANY=========================//
    router.post('/api/create-new-company', middlewareControllers.verifyTokenUser,companyController.handleCreateNewCompany)
    router.put('/api/update-company', middlewareControllers.verifyTokenUser,companyController.handleUpdateCompany)
    router.put('/api/ban-company', middlewareControllers.verifyTokenAdmin ,companyController.handleBanCompany)
    router.put('/api/unban-company', middlewareControllers.verifyTokenAdmin ,companyController.handleUnBanCompany)
    router.put('/api/accecpt-company', middlewareControllers.verifyTokenAdmin ,companyController.handleAccecptCompany)
    router.get('/api/get-list-company', companyController.getListCompany)
    router.get('/api/get-all-company', middlewareControllers.verifyTokenAdmin ,companyController.getAllCompanyByAdmin)
    router.put('/api/add-user-company', middlewareControllers.verifyTokenUser,companyController.handleAddUserCompany)
    router.get('/api/get-detail-company-by-userId',companyController.getDetailCompanyByUserId)
    router.get('/api/get-all-user-by-companyId', middlewareControllers.verifyTokenUser,companyController.getAllUserByCompanyId)
    router.put('/api/quit-company', middlewareControllers.verifyTokenUser,companyController.handleQuitCompany)
    router.get('/api/get-detail-company-by-id', companyController.getDetailCompanyById)
    //==================API POST==========================//
    router.post('/api/create-new-post', middlewareControllers.verifyTokenUser,postController.handleCreateNewPost)
    router.put('/api/update-post', middlewareControllers.verifyTokenUser,postController.handleUpdatePost)
    router.put('/api/accept-post', middlewareControllers.verifyTokenAdmin ,postController.handleAcceptPost)
    router.put('/api/ban-post', middlewareControllers.verifyTokenAdmin ,postController.handleBanPost)
    router.put('/api/active-post', middlewareControllers.verifyTokenAdmin ,postController.handleActivePost)
    router.get('/api/get-list-post-admin', middlewareControllers.verifyTokenUser,postController.getListPostByAdmin)
    router.get('/api/get-all-post-admin', middlewareControllers.verifyTokenUser,postController.getAllPostByAdmin)
    router.get('/api/get-detail-post-by-id', postController.getDetailPostById)
    router.get('/api/get-filter-post', postController.getFilterPost)
    router.get('/api/get-note-by-post', middlewareControllers.verifyTokenUser,postController.getListNoteByPost)
    router.post('/api/create-reup-post', middlewareControllers.verifyTokenUser,postController.handleReupPost)

    //==================API CV==========================//
    router.post('/api/create-new-cv', middlewareControllers.verifyTokenUser,cvController.handleCreateNewCV)
    router.get('/api/get-all-list-cv-by-post',cvController.getAllListCvByPost)
    router.get('/api/get-detail-cv-by-id', middlewareControllers.verifyTokenUser,cvController.getDetailCvById)
    router.get('/api/get-all-cv-by-userId', middlewareControllers.verifyTokenUser,cvController.getAllCvByUserId)
    router.get('/api/fillter-cv-by-selection', cvController.fillterCVBySelection)
    router.get('/api/check-see-candiate', middlewareControllers.verifyTokenUser,cvController.checkSeeCandiate)
    //==================API PACKAGE==========================//
    router.post('/api/create-package-post', middlewareControllers.verifyTokenAdmin ,packageController.creatNewPackagePost)
    router.put('/api/update-package-post',middlewareControllers.verifyTokenAdmin , packageController.updatePackagePost)
    router.get('/api/get-all-package',middlewareControllers.verifyTokenUser,packageController.getAllPackage)
    router.put('/api/set-active-package-post', middlewareControllers.verifyTokenAdmin ,packageController.setActiveTypePackage)
    router.get('/api/get-package-by-type', middlewareControllers.verifyTokenUser,packageController.getPackageByType)
    router.get('/api/get-package-by-id', middlewareControllers.verifyTokenUser,packageController.getPackageById)
    router.get('/api/get-payment-link', middlewareControllers.verifyTokenUser,packageController.getPaymentLink)
    router.post('/api/payment-success',middlewareControllers.verifyTokenUser  ,packageController.paymentOrderSuccess)
    //==================API PACKAGE CV==========================//
    router.post('/api/create-package-cv', middlewareControllers.verifyTokenAdmin ,packageCvController.creatNewPackageCv)
    router.put('/api/update-package-cv',middlewareControllers.verifyTokenAdmin , packageCvController.updatePackageCv)
    router.put('/api/set-active-package-cv', middlewareControllers.verifyTokenAdmin ,packageCvController.setActiveTypePackage)
    router.get('/api/get-all-package-cv',middlewareControllers.verifyTokenUser,packageCvController.getAllPackage)
    router.get('/api/get-package-cv-by-id', middlewareControllers.verifyTokenUser,packageCvController.getPackageById)
    router.get('/api/get-all-package-cv-select',middlewareControllers.verifyTokenUser,packageCvController.getAllToSelect)
    return app.use("/", router);
}

module.exports = initWebRoutes;