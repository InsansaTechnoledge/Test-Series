// ecosystem.config.js
export const apps = [
    {
        name: 'backend-api',
        cwd: __dirname, // ensure PM2 runs from this folder
        script: 'server/server.js', // <-- your real entry file

        // Preload dotenv BEFORE any imports execute
        node_args: ['-r', 'dotenv/config'],
        env_file: '.env', // load envs from .env
        env: {
            NODE_ENV: 'production',
        },
        // Process settings
        exec_mode: 'fork', // you can switch to 'cluster' later
        instances: 1,
        watch: false,
        autorestart: true,
        max_restarts: 10,
        max_memory_restart: '1G',

        // Logs
        out_file: 'logs/backend-api-out.log',
        error_file: 'logs/backend-api-error.log',
        merge_logs: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS Z',
        // Optional: ignore watching logs/node_modules if you turn watch on
        ignore_watch: ['node_modules', 'logs'],
    },
];
  g