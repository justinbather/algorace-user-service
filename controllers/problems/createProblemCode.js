const ProblemCode = require("../../schemas/ProblemCodeSchema");

const createProblemCode = async (req, res) => {
  const {
    title,
    language,
    userStarterCode,
    filePrefix,
    inputCode,
    callerCode,
    output,
  } = req.body;
  try {
    const problem = await ProblemCode.create({
      title,
      language,
      userStarterCode,
      filePrefix,
      inputCode,
      callerCode,
      output,
    });

    if (problem) {
      return res.status(201).json({ success: true, problem });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "error creating problem", error: err });
  }
};

module.exports = createProblemCode;
