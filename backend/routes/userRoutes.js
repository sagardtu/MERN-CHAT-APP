const express = require("express");

const { registerUser } = require("../controllers/userController");
const { authUser } = require("../controllers/userController");
const { allUsers } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//resisterUser & authUser are controller used to register and sign in
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);

module.exports = router;
