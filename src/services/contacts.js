import { app } from "../server.js";
import { Contact } from "../db/models/contact.js"


export const appGet = () => {

    app.get('/contacts', async (req, res) => {
        const contacts = await Contact.find();

        res.send({ status: 200, message: "Successfully found contacts!",data: contacts })
    })
}

export const appGetById = () => {
    app.get('/contacts/:contactId', async (req, res) => {
        
        const { contactId } = req.params;
        try {
            const contactss = await Contact.findById(contactId);
             console.log(contactss);

            res.send({ status: 200, message: `Successfully found contact with id ${contactId}!`, data: contactss })
            
        } catch (error) {
            res.status(404).send({message: 'Contact not found'})  
        }

       
    })
}