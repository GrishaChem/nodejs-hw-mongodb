import express from 'express';

import {
    createContactsController,
    getContactByIdController,
    getContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getContactsController)); 

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController)); 

router.post('/contacts',jsonParser, ctrlWrapper(createContactsController)); 

export default router;