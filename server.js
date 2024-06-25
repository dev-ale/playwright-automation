const express = require('express');
const { exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
app.get('/build', (req, res) => {
    // Ensure the dist directory exists and is empty
    const distDir = path.join(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
        fs.readdirSync(distDir).forEach(file => {
            fs.unlinkSync(path.join(distDir, file));
        });
    } else {
        fs.mkdirSync(distDir);
    }

    exec('npm run build', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing build: ${error}`);
            return res.status(500).send(`Build failed: ${stderr}`);
        }
        console.log(`Build output: ${stdout}`);

        // Move the built files to the dist directory
        const platforms = ['linux', 'macos', 'win.exe'];
        platforms.forEach(platform => {
            const src = path.join(__dirname, `protekta-test-${platform}`);
            const dest = path.join(distDir, `protekta-test-${platform}`);
            if (fs.existsSync(src)) {
                fs.renameSync(src, dest);
                // Set executable permissions for macOS and Linux
                if (platform !== 'win.exe') {
                    fs.chmodSync(dest, '755');
                }
            }
        });

        res.send(`Build succeeded: ${stdout}`);
    });
});

app.get('/get-code', (req, res) => {
    const testFilePath = path.join(__dirname, 'test.js');
    fs.readFile(testFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading test file: ${err}`);
            return res.status(500).send(`Failed to read test file: ${err}`);
        }
        res.send(data);
    });
});

app.post('/save-code', (req, res) => {
    const testFilePath = path.join(__dirname, 'test.js');
    fs.writeFile(testFilePath, req.body.content, 'utf8', (err) => {
        if (err) {
            console.error(`Error saving test file: ${err}`);
            return res.status(500).send(`Failed to save test file: ${err}`);
        }
        res.send('Test file saved successfully');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
