const express = require('express')
const cors = require('cors')
const compression = require('compression')

const server = express()
const zfsRouter = require('./routers/zfs')

server.use(cors())
server.use(compression())

server.use('/zfs', zfsRouter)

let port = process.env.PORT || '8080';
server.listen(port);
