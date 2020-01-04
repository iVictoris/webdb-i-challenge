const db = require("../dbConfig");

const find = () => {
  return db("accounts");
};

const findById = id => {
  return db("accounts")
    .where({ id })
    .first();
};

const create = account => {
  // account should be structured as {name: string budget: number}
  return db("accounts")
    .insert({ ...account })
    .then(ids => {
      return findById(ids[0]);
    });
};

const update = (id, changes) => {
  return db("accounts")
    .where({ id })
    .update({ ...changes })
    .then(_ => findById(id));
};

const remove = id => {
  return db("accounts")
    .where({ id })
    .del();
};

module.exports = {
  find,
  findById,
  create,
  update,
  remove
};
