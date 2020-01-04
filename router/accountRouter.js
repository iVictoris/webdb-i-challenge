const { Router } = require("express");
const router = Router();

const {
  find,
  findById,
  create,
  update,
  remove
} = require("../data/accounts/accounts");

const validateAccounts = (req, res, next) => {
  // this is to only be used if there's a post request to /api/accounts/ with a post req
  const { body, method, baseUrl } = req;
  const { name, budget } = body;
  console.log(method);

  if ((method === "POST" || method === "PUT") && baseUrl === "/api/accounts") {
    if (!body)
      return res.status(400).json({
        message: "missing body"
      });

    if (!name || !budget)
      return res.status(400).json({
        message: "missing name or budget amount which are both required."
      });

    try {
      req.body.budget = Number.parseInt(budget);
    } catch (error) {
      res.status(400).json({
        message:
          "Supplied budget could not be parsed, please enter valid budget"
      });
    }
  }
  next();
};

const loadAccount = async (req, res, next) => {
  const { params } = req;
  const { id } = params;

  try {
    const accountFromId = await findById(id);
    if (!accountFromId)
      return res.status(404).json({
        message: "An account with that id was not found. Please try again."
      });

    req.account = accountFromId;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Server issue attempting to load account"
    });
  }
};

router.post("/", validateAccounts);
router.put("/:id", validateAccounts);
router.use("/:id", loadAccount);

router
  .route("/")
  .get(async (req, res) => {
    /* GET api/accounts */
    try {
      const accounts = await find();
      res.status(200).json(accounts);
    } catch (error) {
      res.status(500).json({
        message: "Server issue in retrieving accounts. Please try again"
      });
    }
  })
  .post(async (req, res) => {
    /* POST api/accounts */
    const { body } = req;
    try {
      const accountFromBody = { ...body };
      const account = await create(accountFromBody);
      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({
        message: "server issue creating account resource"
      });
    }
  });

router
  .route("/:id")
  .get(async ({ account }, res) => {
    /* GET api/accounts /id*/
    res.status(200).json(account);
  })
  .delete(async ({ account }, res) => {
    /* DELETE api/accounts /id */
    try {
      await remove(account.id);
      res
        .status(200)
        .json(account);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
        message: "Server issue removing account"
      });
    }
  })
  .put(async ({ account, body }, res) => {
    /* UPDATE api/accounts/id */
    const modifiedAccount = { ...account, ...body };
    try {
      const updatedAccount = await update(account.id, modifiedAccount);
      res.status(200).json(updatedAccount);
    } catch (error) {
      res.status(500).json({
        message: "Server issue in updating account"
      });
    }
  });

module.exports.router = router;
