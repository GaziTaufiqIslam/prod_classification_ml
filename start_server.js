#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Configuration
const PORT = 8000;
const DIRECTORY = '.'; // Current directory, or specify a path

console.log('Starting live server...');

// Start live-server
const server = spawn('npx', ['live-server', DIRECTORY, `--port=${PORT}`, '--open'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('Failed to start server:', error);
  console.log('\nMake sure live-server is installed:');
  console.log('npm install -g live-server');
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server stopped with code ${code}`);
});