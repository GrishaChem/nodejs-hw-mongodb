import { app } from '../server.js';
import { Contact } from '../db/models/contact.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const queryConditions = { userId };

  if (filter.type != undefined) {
    queryConditions.contactType = filter.type;
  }

  if (filter.isFavourite != undefined) {
    queryConditions.isFavourite = filter.isFavourite;
  }

  const contactQuery = Contact.find(queryConditions);

  const [total, contacts] = await Promise.all([
    Contact.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems: total,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
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
  return await Contact.findByIdAndUpdate(contactId, contact, { new: true });
};
