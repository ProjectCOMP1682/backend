import express from "express";
import userController from '../controllers/userController';
import allcodeController from '../controllers/allcodeController';


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


    return app.use("/", router);
}

module.exports = initWebRoutes;