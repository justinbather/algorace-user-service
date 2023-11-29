const ProblemCode = require('../../schemas/ProblemCodeSchema')

const updateProblemCode = async (req, res) => {
  try {
    const { problemTitle, problemLang } = req.params
    const update = req.body

    const updatedProblem = await ProblemCode.findOneAndUpdate({ title: problemTitle, language: problemLang }, update)

    if (updatedProblem) {
      return res.status(200).json(updatedProblem)
    } else {
      return res.status(400).json({ message: 'failed to update problem', updatedProblem })
    }


  } catch (err) {
    return res.sendStatus(500)
  }
}

module.exports = updateProblemCode
