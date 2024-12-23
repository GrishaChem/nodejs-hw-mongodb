import * as fs from 'node:fs/promises';
import {
  createContacts,
  deleteContacts,
  getContactById,
  getContacts,
  updateContacts,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import path from 'node:path';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export async function getContactsController(req, res) {
  console.log(req.user);

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  console.log({ sortBy, sortOrder, filter });

  console.log({ page, perPage });
  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id,
  });
  res.send({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContactByIdController(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (contact === null) {
    throw new createHttpError.NotFound('Contact not found');
  }
  if (contact.userId.toString() !== req.user.id) {
    throw new createHttpError.NotFound('Contact not found');
  }
  res.send({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContactsController(req, res) {
  let photo = null;
  if (typeof req.file !== 'undefined') {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      console.log(result);

      photo = result.secure_url;
      console.log(photo);
    } else {
      console.log(req.file);
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename),
      );

      photo = `http://localhost:12342/photos/${req.file.filename}`;
    }
  }

  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    userId: req.user.id,
    photo,
  };
  console.log('Contact data before saving:', contact); // Лог перед сохранением
  const result = await createContacts(contact);
  console.log('Saved contact:', result); // Лог после сохранения
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
}

export async function deleteContactByIdController(req, res) {
  const { contactId } = req.params;

  const result = await deleteContacts(contactId);
  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }
  console.log(result);

  res.status(204).send({ status: 204 });
}
export async function updateContactByIdController(req, res) {
  let photo = null;
  if (typeof req.file !== 'undefined') {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      console.log(result);

      photo = result.secure_url;
      console.log(photo);
    } else {
      console.log(req.file);
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename),
      );

      photo = `http://localhost:12342/photos/${req.file.filename}`;
    }
  }
  const { contactId } = req.params;

  console.log('REQFILE', req.body);

  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
    photo,
  };

  console.log('UPDATED CONTACT: ', contact);

  const result = await updateContacts(contactId, contact);

  if (result === null) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
}
