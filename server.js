const express = require('express')
const server = express()

const zfsRouter = require('./routers/zfs')

server.use('/zfs', zfsRouter)

server.listen(8080);
