const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = (req, res) => {
    const distDir = path.join(__dirname, '../dist');
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

        const platforms = ['linux', 'macos', 'win.exe'];
        platforms.forEach(platform => {
            const src = path.join(__dirname, `../protekta-test-${platform}`);
            const dest = path.join(distDir, `protekta-test-${platform}`);
            if (fs.existsSync(src)) {
                fs.renameSync(src, dest);
                if (platform !== 'win.exe') {
                    fs.chmodSync(dest, '755');
                    if (platform === 'macos') {
                        exec(`xattr -d com.apple.quarantine ${dest}`, (err) => {
                            if (err) console.error(`Failed to remove quarantine attribute: ${err}`);
                        });
                    }
                }
            }
        });

        res.send(`Build succeeded: ${stdout}`);
    });
};
