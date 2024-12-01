import express from 'express';

import {
    createContactsController,
    deleteContactByIdController,
    getContactByIdController,
    getContactsController,
    updateContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsController)); 

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController)); 

router.post('/contacts', jsonParser, ctrlWrapper(createContactsController)); 

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactByIdController)); 

router.patch('/contacts/:contactId',jsonParser, ctrlWrapper(updateContactByIdController)); 



export default router;