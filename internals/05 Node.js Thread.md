### Node.js Thread

- Node.js Event loop is single threaded.
- Some frameworks or standard libraries use multiple threads

For example, the `pbkdf2` library of `crypto` module use multi-thread.

```js
const crypto = require('crypto');

const start = Date.now();
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2:', Date.now() - start);
});
```

As output we will see,

```
1: 1150 // similar value in milliseconds
2: 1159 // similar value in milliseconds
```

Now if these hashing operation was multi-threaded, then, if first one took 1 seconds, the second one will end up 2 seconds.
