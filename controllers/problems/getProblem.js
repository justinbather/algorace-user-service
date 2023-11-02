const Problem = require("../../schemas/ProblemSchema");
const ProblemCode = require("../../schemas/ProblemCodeSchema");

const getProblem = async (req, res) => {
  const titleParam = req.params.problemTitle;
  const langParam = req.params.language;

  try {
    const problem = await ProblemCode.findOne({
      title: titleParam,
      language: langParam,
    });
    if (!problem) {
      console.log("Problem not found");
      return res.status(400).json({ message: "Problem not found" });
    } else {
      return res.status(200).json({
        success: true,
        problem,
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error fetching problem", error: err });
  }
};

module.exports = getProblem;
