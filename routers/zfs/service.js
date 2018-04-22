'use strict';

let _ = require('lodash');
let ExecDaemon = require('../../lib/exec-daemon');
let {
    zfsOutputParser
} = require('../../lib/parser');

let zfsD = new ExecDaemon({
    cmd: '/usr/sbin/zfs',
    args: ['get', '-Hrp', '-t', 'all', '-o', 'name,property,value', 'aclinherit,aclmode,atime,available,canmount,casesensitivity,checksum,clones,compression,compressratio,copies,creation,dedup,defer_destroy,devices,exec,logbias,logicalreferenced,logicalused,mounted,mountpoint,nbmand,normalization,origin,primarycache,quota,readonly,recordsize,redundant_metadata,refcompressratio,referenced,refquota,secondarycache,setuid,sharenfs,sharesmb,snapdir,sync,type,used,usedbychildren,usedbydataset,usedbyrefreservation,usedbysnapshots,userrefs,utf8only,version,volblocksize,volsize,vscan,written,xattr,zoned,name'],
    interval: 5
});

zfsD.on('done', function(output) {
    let datasets = zfsOutputParser(output)

    process.send({
        type: 'ZFS_LIST',
        data: Object.keys(datasets)
    });

    process.send({
        type: 'ZFS_DATASETS',
        data: datasets
    });

    process.send({
        type: 'ZFS_FILESYSTEMS',
        data: _.values(datasets).filter(function(ds) {
            return (ds.type === 'filesystem')
        }).map((ds) => ds.name)
    })

    process.send({
        type: 'ZFS_VOLUMES',
        data: _.values(datasets).filter(function(ds) {
            return (ds.type === 'volume')
        }).map((ds) => ds.name)
    })

    process.send({
        type: 'ZFS_SNAPSHOTS',
        data: _.values(datasets).filter(function(ds) {
            return (ds.type === 'snapshot')
        }).map((ds) => ds.name)
    })

    process.send({
        type: 'ZFS_CLONES',
        data: _.values(datasets).filter(function(ds) {
            return (ds.origin !== '' && (ds.type === 'filesystem' || ds.type === 'volume'))
        }).map((ds) => ds.name)
    })
});

zfsD.on('error', function(err) {
    console.log(err);
});
