import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initwebRoutes from "./routes/web";
import connectDB from "./config/connectDB";
import {sendMessage} from './services/messageService'
import {sendJobMail,updateFreeViewCv} from "./utils/schedule"

import http from "http";

require('dotenv').config();

let app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
viewEngine(app);
initwebRoutes(app);
sendJobMail();
updateFreeViewCv()
connectDB();

const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});
socketIo.on("connection", (socket) => {
    console.log("New client connected" + socket.id);

    socket.on("sendDataClient", function(data) {
        sendMessage(data)
        socketIo.emit("sendDataServer", { data });
    })
    socket.on("loadRoomClient", function(data) {

        socketIo.emit("loadRoomServer", { data });
    })
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
let port = process.env.PORT || 6969;

server.listen(port, () => {
    console.log("Backend Nodejs is running on the port : " + port)
});