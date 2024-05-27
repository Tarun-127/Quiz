const express = require("express");
const signupControllers = require("../controllers/signupControllers");
const loginControllers = require("../controllers/loginControllers");
const { getUser } = require("../controllers/getUser");
const verifyAuth = require("../middlewares/verifyAuth");

const router = express.Router();

router.post("/signup", signupControllers.signup);
router.post("/login", loginControllers.login);
router.get("/getUser", verifyAuth, getUser);

module.exports = router;
