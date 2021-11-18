const router = require("express").Router();
const controller = require("./clinics.controller");
const methodNotAllowed = require("../error/methodNotAllowed");

router
  .route("/")
  .get(controller.read)
  .all(methodNotAllowed);



module.exports = router;
