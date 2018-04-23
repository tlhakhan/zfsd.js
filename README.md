# zfsd.js
zfs api in nodejs.

## Running server
- Clone git repo.
- Install npm dependencies.
- Start server.

```bash
git clone git clone https://github.com/tlhakhan/zfsd.js
cd zfsd.js
npm install
npm start

# server will listen on port 8080
# example:  http://localhost:8080/zfs/list
```

## Use Case
- Receive a zfs dataset over http.

```bash
[root@smos-00 ~]# curl -so- "http://smos-01:8080/zfs/send?initialSnapshot=zones/opt@today&incremental=false" | zfs recv -vF clusters/vmgr/opt_from_smos-01
receiving full stream of zones/opt@today into clusters/vmgr/opt_from_smos-01@today
received 1.04GB stream in 8 seconds (133MB/sec)
```

### API
- `/zfs/list`: list all datasets on server.
- `/zfs/snapshots`: list all snapshots.
  - takes a query parameter `filesystem`, which will return only snapshots of the given filesystem.
- `/zfs/filesystems`: list all filesystems.
- `/zfs/clones`: list all clones.
- `/zfs/volumes`: list all volumes.
- `/zfs/datasets`: list all datasets with full details.
- `/zfs/dataset`
  - takes a query parameter `name` which will return only details of the given dataset name.
- `/zfs/send`
  - takes a switched query paramter `incremental`, values can be only `true` or `false`.
  - when `true`, additional query parameters `startSnapshot` and `endSnapshot` must be given.
  - when `false`, additional query parameter `initialSnapshot` must be given.
