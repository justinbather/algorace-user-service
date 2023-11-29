const Problem = require("../../schemas/ProblemSchema");
const ProblemCode = require("../../schemas/ProblemCodeSchema")

const createProblem = async (req, res) => {
  const { title, category, difficulty, starterCode } = req.body;

  try {

    const problem = await ProblemCode.create(req.body)
    console.log(problem)
    return res.status(201).json({ success: true, problem });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "failed to create problem", error: err });
  }
};

module.exports = createProblem;
