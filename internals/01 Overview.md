### Overview (What is Node.js?)

- V8
  - Allow running JavScript outside of browser
- libuv
  - Allow node js to access the underlying file system of operating system
  - Networking
  - Handle some part of concurrency

Q: What the use case of node js? Why we do not directly use V8 or libuv?

Answer:

V8 = (30% JS + 70% C++)

libuv = 100 C++

As javascript developer, we do no want to write C++ to interact and making use of `V8` and `libuv`.

Node.js provide an interface, where our JS code can make use of these C++ codes. Node also provides a series of wrappers to use in our application like, `http module`, `fs module`, `crypto module` and `path module` etc.

Most of these modules are using the functionalities from the `libuv`, internally written in C++. By making use of node, we can invoke the function in javascript and these function will call the C++ codes.
