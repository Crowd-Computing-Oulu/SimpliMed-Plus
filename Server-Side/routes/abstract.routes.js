const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authToken");
const {
  submitFeedback,
  requestAbstract,
} = require("../controllers/abstract.controller.js");

router.post("/abstract", verifyToken, requestAbstract, function (req, res) {});
router.post(
  "/submitFeedback",
  verifyToken,
  submitFeedback,
  function (req, res) {}
);

module.exports = router;
