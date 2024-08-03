import { Router } from "express";
import { veriifyToken } from "../middlewares/AuthMiddleware.js";
import { getAllContacts, getContactForDMList, searchContacts } from "../controllers/contactController.js";

 const contactsRoute = Router();

contactsRoute.post('/search' , veriifyToken , searchContacts);
contactsRoute.get('/get-contact-for-dm', veriifyToken , getContactForDMList);
contactsRoute.get('/get-all-contacts', veriifyToken , getAllContacts);

export default contactsRoute;