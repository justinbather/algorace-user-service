const express = require("express");
const verifyUser = require("../middleware/verifyUser");
const createProblem = require("../controllers/problems/createProblem");
const getProblem = require("../controllers/problems/getProblem");
const getAllProblems = require("../controllers/problems/getAllProblems");

const router = express.Router();

router.get("/:problemId", verifyUser, getProblem);

router.post("/", verifyUser, createProblem);
router.get("/", verifyUser, getAllProblems);

module.exports = router;
