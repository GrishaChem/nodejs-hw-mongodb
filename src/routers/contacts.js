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

router.get('/', ctrlWrapper(getContactsController)); 

router.get('/:contactId', isValidId, ctrlWrapper(getContactByIdController)); 

router.post('/', jsonParser, validateBody(contactsSchema), ctrlWrapper(createContactsController)); 

router.delete('/:contactId', isValidId, ctrlWrapper(deleteContactByIdController)); 

router.patch('/:contactId',jsonParser, validateBody(updateContactsSchema), isValidId, ctrlWrapper(updateContactByIdController)); 



export default router;