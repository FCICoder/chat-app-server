import { Router } from "express";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import { createChannel, getCHannelMessages, getUserChannels } from "../controllers/ChannelController.js";

const channelRoute = Router();


channelRoute.post('/create-channel' , veriifyToken , createChannel);
channelRoute.get('/get-user-channel' , veriifyToken , getUserChannels);
channelRoute.get('/get-channel-messages/:channelId' , veriifyToken , getCHannelMessages);
export default channelRoute;