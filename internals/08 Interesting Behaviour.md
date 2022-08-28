Observe the following codes,

```js
const start = new Date.now();

function doRequest() {
    // making a http request
    console.log(`HTTP: ${Date.now() - start}ms`);
}

function doHash() {
    crypto.pbkdf2(...args, () => {
    console.log(`Hash: ${Date.now() - start}ms`);
  });
}

doRequest();

fs.readFile('fileName', 'format', () => {
    console.log(`FS: ${Date.now() - start}ms`)
});

doHash();
doHash();
doHash();
doHash();
```

Output,

```
Network: time
Hash: time
FS: time
Hash: time
Hash: time
Hash: time
```

Facts:

- There's no way File System operation should take more time than a hashing
- Why always HTTP request comes first
- Why always a hash operation takes place before the file operation

Explaination:

HTTP calls are handles by OS itself. On the other hand, file system operation and hashing operation are handled by the thread pool. So while other operations making it to the thread pool, we get results from http request.

For file system operation, there are two distinct process,
- Get stat about the file
- Read the file

By default we have 4 threads in the thread pool. We have 5 operations, 1 file system operation and 4 hash operation. Among them, initially, 1 fs took one thread and 3 hash take other 3 threads.

The first thread, While we go and look at the stat of the file, and wait for stats, the one leftover hash took place in the pool.
In the meantime, the file stats are ready.
The moment one hash is completed, the empty thread take the leftover file operation and make it completed almost immediately.


Now if we make the thread pool size 5,

```js
process.env.UV_THREADPOOL_SIZE = 5;

const start = new Date.now();

function doRequest() {
    // making a http request
    console.log(`HTTP: ${Date.now() - start}ms`);
}

function doHash() {
    crypto.pbkdf2(...args, () => {
    console.log(`Hash: ${Date.now() - start}ms`);
  });
}

doRequest();

fs.readFile('fileName', 'format', () => {
    console.log(`FS: ${Date.now() - start}ms`)
});

doHash();
doHash();
doHash();
doHash();
```

Output will be,

```
FS: time
Network: time
Hash: time
Hash: time
Hash: time
Hash: time
```

What if we make the threadpool size 1,

```
Network: time
Hash: time
Hash: time
Hash: time
Hash: time
FS: time
```