import { app } from "../server.js";
import { Contact } from "../../models/contact.js"


export const appGet = () => {

    app.get('/contacts', async (req, res) => {
        const contacts = await Contact.find();

        res.send({ status: 200, message: "Successfully found contacts!",data: contacts })
    })
}