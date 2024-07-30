import { Router } from "express";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import { searchContacts } from "../controllers/contactController.js";

 const contactsRoute = Router();

contactsRoute.post('/search' , veriifyToken , searchContacts)

export default contactsRoute;