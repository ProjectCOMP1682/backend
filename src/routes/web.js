import express from "express";
import userController from '../controllers/userController';


import middlewareControllers from '../middlewares/jwtVerify'
let router = express.Router();

let initWebRoutes = (app) => {

    //=====================API USER==========================//
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/update-user', userController.handleUpdateUser)
    router.post('/api/ban-user' , middlewareControllers.verifyTokenAdmin,userController.handleBanUser)
    router.post('/api/unban-user', middlewareControllers.verifyTokenAdmin ,userController.handleUnbanUser)
    router.post('/api/login', userController.handleLogin)

    return app.use("/", router);
}

module.exports = initWebRoutes;