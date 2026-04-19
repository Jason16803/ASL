const {
  ContactModel,
  Pager,
  sortContacts,
  filterContacts
} = require("@jworkman-fs/asl");

// Safest starting point: use package-provided contacts if available.
let contacts = ContactModel.getContacts
  ? ContactModel.getContacts()
  : ContactModel.contacts || [];

/**
 * Maps library exceptions to HTTP responses.
 */
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
    let results = [...contacts];

    // 1) FILTERING via headers, not query params
    const filterBy = req.get("X-Filter-By");
    const filterOperator = req.get("X-Filter-Operator");
    const filterValue = req.get("X-Filter-Value");

    if (filterBy || filterOperator || filterValue) {
      results = filterContacts(results, filterBy, filterOperator, filterValue);
    }

    // 2) SORTING via query params
    if (req.query.sort || req.query.direction) {
      results = sortContacts(results, req.query.sort, req.query.direction);
    }

    // 3) PAGINATION via query params
    const page = req.query.page || 1;
    const size = req.query.size || 10;

    const pager = new Pager(results, page, size);

    res.set("X-Page-Total", String(pager.total()));
    res.set("X-Page-Next", String(pager.next()));
    res.set("X-Page-Prev", String(pager.prev()));

    return res.status(200).json(pager.results());
  } catch (error) {
    return handleError(res, error);
  }
};

const getContactById = (req, res) => {
  try {
    const id = Number(req.params.id);

    // Try model method first if it exists
    if (typeof ContactModel.findById === "function") {
      const contact = ContactModel.findById(id);
      return res.status(200).json(contact);
    }

    const contact = contacts.find((c) => Number(c.id) === id);

    if (!contact) {
      const err = new Error(`Contact with id ${id} not found.`);
      err.name = "ContactNotFoundError";
      throw err;
    }

    return res.status(200).json(contact);
  } catch (error) {
    return handleError(res, error);
  }
};

const createContact = (req, res) => {
  try {
    // Prefer library model create if available
    if (typeof ContactModel.create === "function") {
      const created = ContactModel.create(req.body);
      contacts = ContactModel.getContacts
        ? ContactModel.getContacts()
        : contacts.concat(created);

      return res.status(201).json(created);
    }

    const { fname, lname, email, phone, birthday } = req.body;

    if (!fname || !lname || !email || !phone || !birthday) {
      const err = new Error("Missing required contact fields.");
      err.name = "InvalidContactSchemaError";
      throw err;
    }

    const duplicate = contacts.find((c) => c.email === email);
    if (duplicate) {
      const err = new Error("A contact with that email already exists.");
      err.name = "DuplicateContactResourceError";
      throw err;
    }

    const maxId = contacts.length ? Math.max(...contacts.map((c) => Number(c.id))) : 0;

    const newContact = {
      id: maxId + 1,
      fname,
      lname,
      email,
      phone,
      birthday
    };

    contacts.push(newContact);

    return res.status(201).json(newContact);
  } catch (error) {
    return handleError(res, error);
  }
};

const updateContact = (req, res) => {
  try {
    const id = Number(req.params.id);

    // Prefer library model update if available
    if (typeof ContactModel.update === "function") {
      ContactModel.update(id, req.body);
    } else {
      const index = contacts.findIndex((c) => Number(c.id) === id);

      if (index === -1) {
        const err = new Error(`Contact with id ${id} not found.`);
        err.name = "ContactNotFoundError";
        throw err;
      }

      contacts[index] = {
        ...contacts[index],
        ...req.body,
        id
      };
    }

    return res.status(303).redirect(`/contacts/${id}`);
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteContact = (req, res) => {
  try {
    const id = Number(req.params.id);

    if (typeof ContactModel.delete === "function") {
      ContactModel.delete(id);
      return res.status(204).send();
    }

    const index = contacts.findIndex((c) => Number(c.id) === id);

    if (index === -1) {
      const err = new Error(`Contact with id ${id} not found.`);
      err.name = "ContactNotFoundError";
      throw err;
    }

    contacts.splice(index, 1);

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