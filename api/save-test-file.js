const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
    const testFilePath = path.join(__dirname, '../test.js');
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const { content } = JSON.parse(body);
        if (!content) {
            return res.status(400).send('Content is required');
        }
        fs.writeFile(testFilePath, content, 'utf8', (err) => {
            if (err) {
                console.error(`Error saving test file: ${err}`);
                return res.status(500).send(`Failed to save test file: ${err}`);
            }
            res.send('Test file saved successfully');
        });
    });
};
