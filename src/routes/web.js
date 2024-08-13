import express from "express";
import userController from '../controllers/userController';
import allcodeController from '../controllers/allcodeController';
import companyController from '../controllers/companyController';


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

    //===================API ALLCODE========================//
    router.post('/api/create-new-all-code',middlewareControllers.verifyTokenAdmin ,allcodeController.handleCreateNewAllCode)
    router.put('/api/update-all-code', middlewareControllers.verifyTokenAdmin,allcodeController.handleUpdateAllCode)
    router.delete('/api/delete-all-code', middlewareControllers.verifyTokenAdmin,allcodeController.handleDeleteAllCode)
    router.get('/api/get-all-code', allcodeController.getAllCodeService)
    router.get('/api/get-detail-all-code-by-code', allcodeController.getDetailAllcodeByCode)
    router.get('/api/get-list-allcode', allcodeController.getListAllCodeService)

    //==================API COMPANY=========================//
    router.post('/api/create-new-company', middlewareControllers.verifyTokenUser,companyController.handleCreateNewCompany)
    router.put('/api/update-company', middlewareControllers.verifyTokenUser,companyController.handleUpdateCompany)

    return app.use("/", router);
}

module.exports = initWebRoutes;