# zfsd.js
zfs api in nodejs.

## Use case
- Receive a zfs dataset over http.

```bash
[root@smos-00 ~]# curl -so- "http://smos-01:8080/zfs/send?initialSnapshot=zones/opt@today&incremental=false" | zfs recv -vF clusters/vmgr/opt_from_smos-01
receiving full stream of zones/opt@today into clusters/vmgr/opt_from_smos-01@today
received 1.04GB stream in 8 seconds (133MB/sec)
```

### Example benchmark
- Running two zfsd.js on different ports load-balanced, generating sends and receives at ~460 MB/s

```bash
     LINK    IPKTS   RBYTES    OPKTS   OBYTES  
    aggr0  321.98K  484.41M  104.00K    6.86M  
    aggr0  313.40K  471.51M  101.00K    6.67M  
    aggr0  311.57K  468.76M   99.55K    6.57M  
    aggr0  310.02K  466.41M  100.33K    6.62M  
    aggr0  310.61K  467.31M   99.31K    6.56M  
    aggr0  284.97K  428.73M   91.70K    6.05M  
    aggr0  317.04K  477.00M  105.53K    6.97M  
    aggr0  326.33K  490.96M  105.28K    6.95M  
    aggr0  318.42K  479.02M  102.65K    6.78M  
    aggr0  292.41K  439.93M  103.77K    6.85M  
    aggr0  290.73K  437.39M  103.14K    6.81M  
    aggr0  326.92K  491.81M  104.80K    6.92M  
```

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

## API
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
  - when ^C or client is gone, the zfs send process is killed using SIGTERM.
