'use strict';

let router = require('express').Router();
let store = require('./store');

let {
  spawn
} = require('child_process')


router.route('/send').get((req, res) => {
  let { incremental } = req.query
  let isValid = (name) => store.get('ZFS_SNAPSHOTS').some((snap) => snap == name);

  switch (incremental) {
    case "true":
      let { startSnapshot, endSnapshot } = req.query;
      if (isValid(startSnapshot) && isValid(endSnapshot)) {
        let send = spawn('/usr/sbin/zfs', ['send', '-I', startSnapshot, endSnapshot])
        send.stdout.pipe(res)
        req.on('close', () => send.kill())
      } else {
        res.end()
      }
      break;
    case "false":
      let { initialSnapshot } = req.query;
      if (isValid(initialSnapshot)) {
        let send = spawn('/usr/sbin/zfs', ['send', initialSnapshot])
        send.stdout.pipe(res)
        req.on('close', () => send.kill())
      } else {
        res.end()
      }
      break
  }
})

router.route('/list').get(function(req, res) {
  res.json(store.get('ZFS_LIST'));
});

router.route('/dataset').get(function(req, res) {
  let { name } = req.query;
  if (store.get('ZFS_DATASETS')[name]) {
    res.json(store.get('ZFS_DATASETS')[name])
  } else {
    res.json({})
  }
});

router.route('/datasets').get(function(req, res) {
  res.json(store.get('ZFS_DATASETS'));
});

router.route('/snapshots').get(function(req, res) {
  let { filesystem } = req.query;
  let isValid = (name) => store.get('ZFS_FILESYSTEMS').some(fs => fs == name)
  if (isValid(filesystem)) {
		let found = store.get('ZFS_SNAPSOTS').filter(snap => snap.split('@')[0] == filesystem)
		res.json(found)
  } else {
    res.json(store.get('ZFS_SNAPSHOTS'))
  }
});

router.route('/filesystems').get(function(req, res) {
  res.json(store.get('ZFS_FILESYSTEMS'));
});

router.route('/volumes').get(function(req, res) {
  res.json(store.get('ZFS_VOLUMES'));
});

router.route('/clones').get(function(req, res) {
  res.json(store.get('ZFS_CLONES'))
});

module.exports = router;
