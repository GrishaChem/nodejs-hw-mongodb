import Joi from "joi";

export const contactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().pattern(/^[+]?[0-9]{1,3}?[-.\s]?[(]?[0-9]{1,4}?[)]?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/).required(),
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: true}}),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().required()
})

export const updateContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().pattern(/^[+]?[0-9]{1,3}?[-.\s]?[(]?[0-9]{1,4}?[)]?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/),
    email: Joi.string().email({minDomainSegments: 2, tlds: {allow: true}}),
    isFavourite: Joi.boolean(),
    contactType: Joi.string()
})
