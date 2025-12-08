module.exports = {
  apps: [
    {
      name: 'qsub-net',
      script: 'server.py',
      interpreter: 'python',
      cwd: 'C:/sites/qsub.net',
      env: {
        PORT: 8089
      },
      watch: false,
      max_memory_restart: '500M',
      error_file: 'C:/sites/quanta/logs/qsub-net-error.log',
      out_file: 'C:/sites/quanta/logs/qsub-net-out.log',
      log_file: 'C:/sites/quanta/logs/qsub-net-combined.log',
      time: true
    }
  ]
};
