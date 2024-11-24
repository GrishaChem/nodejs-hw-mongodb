import express from 'express';

import {
    getContactByIdController,
    getContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/contacts', ctrlWrapper(getContactsController)); 

router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController)); 

export default router;