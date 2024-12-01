import { app } from "../server.js";
import { Contact } from "../db/models/contact.js"


export const getContacts = async () => {
  return await Contact.find();
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContacts = async (contact) => {
  return await Contact.create(contact);
};

export const deleteContacts = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};

export const updateContacts = async (contactId, contact) => {
  return await Contact.findByIdAndUpdate(contactId, contact, {new: true});
};

