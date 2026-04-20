const {
  ContactModel,
  Pager,
  sortContacts,
  filterContacts
} = require("@jworkman-fs/asl");

// const getDataset = () => {
//   if (typeof ContactModel.all === "function") return ContactModel.all();
//   if (typeof ContactModel.getContacts === "function") return ContactModel.getContacts();
//   if (Array.isArray(ContactModel.contacts)) return ContactModel.contacts;
//   return [];
// };

const getDataset = () => {
  return [...ContactModel.index()];
};

const handleError = (res, error) => {
  switch (error?.name) {
    case "InvalidContactError":
    case "InvalidContactFieldError":
    case "InvalidContactSchemaError":
    case "InvalidEnumError":
      return res.status(400).json({ message: error.message });

    case "ContactNotFoundError":
      return res.status(404).json({ message: error.message });

    case "DuplicateContactResourceError":
      return res.status(409).json({ message: error.message });

    case "PagerOutOfRangeError":
      return res.status(404).json({ message: error.message });

    case "PagerLimitExceededError":
      return res.status(400).json({ message: error.message });

    default:
      return res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getAllContacts = (req, res) => {
  try {
    let results = getDataset();

    const filterBy = req.get("X-Filter-By");
    const filterOp = req.get("X-Filter-Operator");
    const filterValue = req.get("X-Filter-Value");

    if (filterBy && filterOp && filterValue !== undefined) {
      results = filterContacts(filterBy, filterOp, filterValue, results);
    }

    if (req.query.sort) {
      results = sortContacts(results, req.query.sort, req.query.direction || "asc");
    }

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const pager = new Pager(results, page, limit);

    res.set("X-Page-Total", String(pager.total));
    res.set("X-Page-Next",  String(pager.next()));
    res.set("X-Page-Prev",  String(pager.prev()));

    return res.json(pager.results());
  } catch (error) {
    return handleError(res, error);
  }
};

const getContactById = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (typeof ContactModel.findById === "function") {
      const contact = ContactModel.findById(id);
      return res.json(contact);
    }

    const contact = getDataset().find((c) => Number(c.id) === id);

    if (!contact) {
      const err = new Error("Not found");
      err.name = "ContactNotFoundError";
      throw err;
    }

    return res.json(contact);
  } catch (error) {
    return handleError(res, error);
  }
};

const createContact = (req, res) => {
  try {
    let created;

    if (typeof ContactModel.create === "function") {
      created = ContactModel.create(req.body);
    } else {
      const contacts = getDataset();
      const nextId = contacts.length
        ? Math.max(...contacts.map((c) => Number(c.id))) + 1
        : 1;

      const { fname, lname, email, phone, birthday } = req.body;
      created = { id: nextId, fname, lname, email, phone, birthday };

      if (Array.isArray(ContactModel.contacts)) {
        ContactModel.contacts.push(created);
      } else {
        contacts.push(created);
      }
    }

    return res.status(303).location(`/v1/contacts/${created.id}`).send();
  } catch (error) {
    return handleError(res, error);
  }
};

const updateContact = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (typeof ContactModel.update === "function") {
      ContactModel.update(id, req.body);
    } else {
      const contacts = getDataset();
      const index = contacts.findIndex((c) => Number(c.id) === id);

      if (index === -1) {
        const err = new Error("Not found");
        err.name = "ContactNotFoundError";
        throw err;
      }

      contacts[index] = {
        ...contacts[index],
        ...req.body,
        id
      };
    }

    return res.status(303).location(`/v1/contacts/${id}`).send();
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteContact = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (typeof ContactModel.delete === "function") {
      ContactModel.delete(id);
    } else if (typeof ContactModel.remove === "function") {
      ContactModel.remove(id);
    } else {
      const contacts = getDataset();
      const index = contacts.findIndex((c) => Number(c.id) === id);

      if (index === -1) {
        const err = new Error(`Contact ${id} not found`);
        err.name = "ContactNotFoundError";
        throw err;
      }

      contacts.splice(index, 1);
    }

    return res.status(204).send();
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
};