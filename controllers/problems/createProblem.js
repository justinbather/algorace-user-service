const Problem = require("../../schemas/ProblemSchema");

const createProblem = async (req, res) => {
  const { title, category, difficulty, starterCode } = req.body;
  try {
    console.log(starterCode);
    const problem = await Problem.create({
      title: title,
      category: category,
      difficulty: difficulty,
      starterCode: starterCode,
    });
    console.log("problem created");
    return res.status(201).json({ success: true, problem });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "failed to create problem", error: err });
  }
};

module.exports = createProblem;
