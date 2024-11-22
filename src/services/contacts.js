import { app } from "../server.js";
import { Contact } from "../db/models/contact.js"


// Отримати всі контакти
export const getContacts = async () => {
  return await Contact.find();
};

// Отримати контакт за ID
export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};