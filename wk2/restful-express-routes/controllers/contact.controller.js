const {
  ContactModel,
  Pager,
  sortContacts,
  filterContacts
} = require("@jworkman-fs/asl");

let contacts = ContactModel.getContacts
  ? ContactModel.getContacts()
  : ContactModel.contacts || [];

const getAllContacts = (req, res) => {
  try {
    let results = [...contacts];

    if (Object.keys(req.query).length > 0) {
      try {
        results = filterContacts(results, req.query);
      } catch (err) {}
    }

    if (req.query.sort) {
      try {
        results = sortContacts(results, req.query.sort);
      } catch (err) {}
    }

    if (req.query.page || req.query.limit) {
      try {
        const pager = new Pager(results, req.query.page, req.query.limit);
        results = pager.getPagedData ? pager.getPagedData() : results;
      } catch (err) {}
    }

    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch contacts." });
  }
};

const getContactById = (req, res) => {
  try {
    const id = Number(req.params.id);
    const contact = contacts.find((c) => Number(c.id) === id);

    if (!contact) {
      return res.status(404).json({ error: "Contact not found." });
    }

    return res.status(200).json(contact);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch contact." });
  }
};

const createContact = (req, res) => {
  try {
    const { firstName, lastName, email, phone, birthday } = req.body;

    if (!firstName || !lastName || !email || !phone || !birthday) {
      return res.status(400).json({ error: "Missing required contact fields." });
    }

    const maxId = contacts.length > 0
      ? Math.max(...contacts.map((c) => Number(c.id)))
      : 0;

    const newContact = {
      id: maxId + 1,
      firstName,
      lastName,
      email,
      phone,
      birthday
    };

    contacts.push(newContact);

    return res.status(201).json(newContact);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create contact." });
  }
};

const updateContact = (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = contacts.findIndex((c) => Number(c.id) === id);

    if (index === -1) {
      return res.status(404).json({ error: "Contact not found." });
    }

    contacts[index] = {
      ...contacts[index],
      ...req.body,
      id
    };

    return res.status(200).json(contacts[index]);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update contact." });
  }
};

const deleteContact = (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = contacts.findIndex((c) => Number(c.id) === id);

    if (index === -1) {
      return res.status(404).json({ error: "Contact not found." });
    }

    contacts.splice(index, 1);

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete contact." });
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};