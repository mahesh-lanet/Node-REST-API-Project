const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express();

router.put("/signup");

module.exports = router;
