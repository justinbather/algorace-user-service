const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const createProblem = require("../controllers/problems/createProblem");
const getProblem = require("../controllers/problems/getProblem");
const getAllProblems = require("../controllers/problems/getAllProblems");
const createProblemCode = require("../controllers/problems/createProblemCode");
const updateProblemCode = require("../controllers/problems/updateProblemCode")

const router = express.Router();

router.get("/:problemTitle/:language", verifyUser, getProblem);

router.post("/", verifyUser, createProblem);
router.patch("/:problemTitle/:problemLang", updateProblemCode)
router.get("/", verifyUser, getAllProblems);

router.post("/code", verifyUser, createProblemCode);

module.exports = router;
