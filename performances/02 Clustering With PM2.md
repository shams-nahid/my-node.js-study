Instead of running clustering manually, in production, better handle using `pm2`.

`PM2` is a cluster management tools can handle the clustering very efficiently.

- Can spin up child server according to the logical core of the server
- Can spin up child server by specify the number
- Can inspect, monitor and log the running instances
- Can start/end/restart the child instances
