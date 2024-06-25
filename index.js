#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const scriptPath = path.resolve(__dirname, 'test.js');

const child = spawn('node', [scriptPath], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code);
});
