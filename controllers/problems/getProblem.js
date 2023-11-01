const Problem = require("../../schemas/ProblemSchema");

const getProblem = async (req, res) => {
  const idParam = req.params.problemId;

  try {
    const problem = await Problem.findById(idParam);
    if (!problem) {
      console.log("Problem not found");
      return res.status(400).json({ message: "Problem not found" });
    } else {
      return res.status(200).json({ success: true, problem });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error fetching problem", error: err });
  }
};

module.exports = getProblem;
