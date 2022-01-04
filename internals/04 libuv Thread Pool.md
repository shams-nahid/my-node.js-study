### libuv Thread Pool

The hashing function `pbkdf2` inside the `crypto` module, has Javascript API but the implementation is delegated to the C++ side (libuv).

Node does some expensive operation like this to the `libuv` and make use of the thread pool.
