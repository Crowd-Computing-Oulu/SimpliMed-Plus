const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authToken");
const { signup, signin } = require("../controllers/auth.controller.js");
const { requestKeywords } = require("../controllers/abstract.controller.js");
router.post("/register", signup, function (req, res) {});
router.post("/login", signin, function (req, res) {});

router.get("/content", verifyToken, function (req, res) {
  if (!req.user) {
    res.status(403).send({ message: "Invalid Token" });
    return;
  }

  if (req.user == "admin") res.status(200).send({ message: "Hi Admin" });
  else res.status(200).send({ message: "Hi Tester" });
  //if (req.user == "tester") res.status(200).send({ message: "Hi Admin" });
});
// Users can ask a question to receive keywords or recieve suggestion on articles
router.post(
  "/suggestions",
  verifyToken,
  requestKeywords,
  function (req, res) {}
);

module.exports = router;
