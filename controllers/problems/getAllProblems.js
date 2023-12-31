const Problem = require("../../schemas/ProblemSchema");

const getAllProblems = async (req, res) => {
  try {
    //Only fetch minimal data for display in lists
    const problems = await Problem.find(
      {},
      "title difficulty category _id"
    ).exec();

    if (!problems) {
    } else {
      return res.status(200).json({ success: true, problems });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
};

module.exports = getAllProblems;
