const config = require('config');

isDevelopment = () => {
    return process.env.NODE_ENV === 'development'
}

startServer = (app,ipAddress,port) => {
    const http= require('http')
    const httpServer = http.createServer(app)

    return httpServer.listen(port, ipAddress, () => {
        console.log('HTTP server is running at ' + ipAddress + ':' + port)
    })
}

runApp = () => {
    const app = require('./app')
    const ipAddress = '0.0.0.0'
    const port = Number(config.get('PORT') || 3000)

    startServer(app, ipAddress, port)
}

if (isDevelopment()) {
    console.log(`Environment: ${process.env.NODE_ENV}`)
    runApp()
} else {
    const cluster = require('cluster')
    const numWorkers = require('os').cpus().length

    if (cluster.isMaster) {
        for (let i = 0; i < numWorkers; i++) {
            cluster.fork()
        }

        cluster.on('listening', (worker) => {
            console.log(new Date() + ' Worker ' + worker.process.pid + ' listening')
        })

        cluster.on('exit', (diedWorker) => {
            console.log(new Date() + ' Worker ' + diedWorker.process.pid + ' just crashed')
            cluster.fork()
        })
    } else {
        runApp()
    }
}