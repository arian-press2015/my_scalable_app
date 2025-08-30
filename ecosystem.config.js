module.exports = {
    apps: [{
        name: "app",
        script: "./app.js",
        instances: 8,
        exec_mode: "cluster",
        watch: false,
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
};