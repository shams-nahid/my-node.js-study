### Thread Pools

Node.js event loop is single thread. Every time we start a  node js program, a single instance of event loop is created and placed into a single thread.

But some standard libray used by node.js is not single threaded. As a result, some functions, implemented in node js is outside of event loop, as well as outside of single thread mechanism.

So, Node.js event loop is single thread but not all the functions written in our code are single threaded.

Example of `pbkdf2` function in `crypto` module:

```js
import crypto from 'crypto';

const start = Date.now();
crypto.pbkdf2(...args, () => {
    console.log(`1: ${Date.now() - start}ms`);
});

crypto.pbkdf2(...args, () => {
    console.log(`2: ${Date.now() - start}ms`);
});
```

Assuming each operation is 1 sec, and node.js is single threaded (each operation executes one after another, taking 1 sec each), the output should be,

```
1: 1000ms
2: 2000ms
```

But, the output is,

```
1: 1000ms
2: 1000ms
```

According to the output, both operation is being executed concurrently.

As an example, `libuv` library make use of 4 threads. As a result, other than event loop single thread, there are 4 thread come up to do some expensive operations by `libuv`.

By default, there are 4 thread pools.

```js
import crypto from 'crypto';

const start = Date.now();

// 1st invocation
crypto.pbkdf2(...args, () => {
    console.log(`1: ${Date.now() - start}ms`);
});

// 2nd invocaction
crypto.pbkdf2(...args, () => {
    console.log(`2: ${Date.now() - start}ms`);
});

// 3rd invocation
crypto.pbkdf2(...args, () => {
    console.log(`3: ${Date.now() - start}ms`);
});

// 4th invocation
crypto.pbkdf2(...args, () => {
    console.log(`4: ${Date.now() - start}ms`);
});
```

Here all 4 operation will be completed concurrently,

```
1: 1000ms
2: 1000ms
3: 1000ms
4: 1000ms
```

Now, if we have 5 operation at a time, the thread pool can perform only 4 at a time, and the 5th operation will be handled lately with additional time,

```js
import crypto from 'crypto';

const start = Date.now();

// 1st invocation
crypto.pbkdf2(...args, () => {
    console.log(`1: ${Date.now() - start}ms`);
});

// 2nd invocaction
crypto.pbkdf2(...args, () => {
    console.log(`2: ${Date.now() - start}ms`);
});

// 3rd invocation
crypto.pbkdf2(...args, () => {
    console.log(`3: ${Date.now() - start}ms`);
});

// 4th invocation
crypto.pbkdf2(...args, () => {
    console.log(`4: ${Date.now() - start}ms`);
});

// 5th invocation
crypto.pbkdf2(...args, () => {
    console.log(`5: ${Date.now() - start}ms`);
});
```

Here all 4 operation will be completed concurrently in 1 sec and the next operation will take 1 additional second,

```
1: 1000ms
2: 1000ms
3: 1000ms
4: 1000ms
5: 2000ms
```

We have the ability to change the threads in the thread pool. If we update the thread pool size,

```js
process.uv.UV_THREADPOOL_SIZE = 5;
```

Now if we execute all 5 operations, all the operations will be execute concurrently, in 1 seconds.