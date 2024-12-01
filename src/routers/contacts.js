import express from 'express';

import {
    createContactsController,
    deleteContactByIdController,
    getContactByIdController,
    getContactsController,
    updateContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/IsValidId.js';
import { contactsSchema, updateContactsSchema } from '../validation/contact.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsController)); 

router.get('/contacts/:contactId', isValidId, ctrlWrapper(getContactByIdController)); 

router.post('/contacts', jsonParser, validateBody(contactsSchema), ctrlWrapper(createContactsController)); 

router.delete('/contacts/:contactId', isValidId, ctrlWrapper(deleteContactByIdController)); 

router.patch('/contacts/:contactId',jsonParser, validateBody(updateContactsSchema), isValidId, ctrlWrapper(updateContactByIdController)); 



export default router;