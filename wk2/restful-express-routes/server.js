const express = require("express");
const contactsRouter = require("./routes/contacts.routes");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/contacts", contactsRouter);

app.listen(PORT, () => {
  console.log(`Contacts API listening on port ${PORT}`);
});