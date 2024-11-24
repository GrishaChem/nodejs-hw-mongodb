import { createContacts, getContactById, getContacts } from "../services/contacts.js";
import createHttpError from "http-errors";

export async function getContactsController(req, res) {
 
    const contacts = await getContacts();
    res.send({ status: 200, message: "Successfully found contacts!", data: contacts });
  
};


export async function getContactByIdController(req, res){
    const { contactId } = req.params;
    const contact = await getContactById(contactId); 
    if (contact === null) {
        throw new createHttpError.NotFound("Contact not found")
    }

    res.send({ status: 200, message: `Successfully found contact with id ${contactId}!`, data: contact });
   
};

export async function createContactsController(req, res) {
   const contact = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType
 }
    const result = await createContacts(contact);
    res.send({ status: 201, message: "Successfully created a contact!", data: result });
  
};