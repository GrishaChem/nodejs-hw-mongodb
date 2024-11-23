import express from "express";
import pinoHttp from "pino-http";
import cors from "cors";
import dotenv from "dotenv";
import { getContacts, getContactById } from "./services/contacts.js"; // Функції для роботи з базою

dotenv.config();

export const app = express();

const logger = pinoHttp();
app.use(logger);
app.use(cors());

app.get("/contacts", async (req, res) => {
 
    const contacts = await getContacts();
    res.send({ status: 200, message: "Successfully found contacts!", data: contacts });
  
});


app.get("/contacts/:contactId", async (req, res) => {
  const { contactId } = req.params;
  try { 
  const contact = await getContactById(contactId); 
    if (contact === null) {
     return res.status(404).send({ message: "Contact not found" });  
    }

    res.send({ status: 200, message: `Successfully found contact with id ${contactId}!`, data: contact });
    } catch (error) {
    return res.status(400).send({ message: error.message || "Contact not found" });
  }
});

app.use((req, res, next) => {
  res.status(404).send({ message: "Not found" });
});

export const setUpServer = () => {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
