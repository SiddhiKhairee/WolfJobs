const { exec } = require('child_process');
const isUndefinedOrEmpty = require("../utils/common");

function runPythonScript(jobDescription, skill) {
    // Construct the command, passing arguments to the Python script
    // Siddhi - const command = `"C:\\Users\\siddh\\AppData\\Local\\Programs\\Python\\Python312\\python.exe" controllers\\script.py "${jobDescription}" "${skill}"`;
    const command = `python3 ./controllers/script.py "${jobDescription}" "${skill}"`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                reject(error);
            }
            if (stderr) {
                console.error(`Python script error: ${stderr}`);
                reject(new Error(stderr));
            }

            resolve(stdout);
        });
    });
}

module.exports.generateQuestions = async function (req, res) {
    const description = req.body.description;
    const skill = req.body.skill;

    if (isUndefinedOrEmpty(req.body.description) || isUndefinedOrEmpty(req.body.skill)) {
      return res.status(400).send({message: `Required fields missing`});
    }
    
    try {
        const op = await runPythonScript(description, skill);
        return res.status(200).send({ data: eval(op) });
    } catch (error) {
      console.error(`Error: ${error}`);
      return res.status(500).send({ message: `Something went wrong: ${error.message}` });
    }
};
