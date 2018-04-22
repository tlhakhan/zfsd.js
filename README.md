# zfsd.js
zfs api in nodejs

## Use Case
- Receive a zfs dataset over http.

```bash
[root@smos-00 ~]# curl -so- "http://smos-01:8080/zfs/send?initialSnapshot=zones/opt@today&incremental=false" | zfs recv -vF clusters/vmgr/opt_from_smos-01
receiving full stream of zones/opt@today into clusters/vmgr/opt_from_smos-01@today
received 1.04GB stream in 8 seconds (133MB/sec)
```
