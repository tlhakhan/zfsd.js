'use strict'
let cp = require('child_process'),
    spawn = cp.spawn
let EventEmitter = require('events').EventEmitter

class ExecDaemon extends EventEmitter {
    constructor(options) {
        super()
        this.cmd = options.cmd
        this.args = options.args
        this.interval = options.interval ? options.interval * 1000 : null

        this.sleeping = true // avoid starting another timer

        // start execution of the command
        this.timer = setInterval(execute, this.interval, this)
    }
}

// exec method
let execute = function(daemon) {
    if (daemon.sleeping) {
        daemon.sleeping = false
        let proc = spawn(daemon.cmd, daemon.args)
        let output = ''
        let error = ''

        proc.stdout.on('data', function(data) {
            output = output.concat(data)
        })

        proc.stderr.on('data', function(data) {
            error = error.concat(data)
        })

        proc.on('close', function(code) {
            daemon.sleeping = true
            if (code == 0) {
                daemon.emit('done', output.trim())
            } else {
                // error has occured
                daemon.emit('error', error.trim())
            }
        })
        
        proc.on('error', function(error) {
            daemon.emit('error', error.trim())
        })
    }
}

module.exports = ExecDaemon
