const { spawn } = require('child_process');

const mintlify = spawn('mintlify', ['dev', '--port', '7778'], {
  cwd: __dirname,
  shell: true,
  stdio: 'inherit'
});

mintlify.on('error', (err) => {
  console.error('Failed to start mintlify:', err);
  process.exit(1);
});

mintlify.on('close', (code) => {
  console.log(`mintlify exited with code ${code}`);
  process.exit(code);
});
