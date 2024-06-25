const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
    const testFilePath = path.join(__dirname, '../test.js');
    fs.readFile(testFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading test file: ${err}`);
            return res.status(500).send(`Failed to read test file: ${err}`);
        }
        res.send(data);
    });
};
