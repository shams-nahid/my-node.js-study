1. What is node.js
2. Why we use node.js instead of directly using V8 and libuv?
3. How node.js utilize V8 and libuv?
4. What is threads on computer and how it works?
5. How os schedular works with threads?
6. What is node.js event loop? Explain from top to bottom. What is a tick in event loop?
7. What is node.js multi-thread?
8. Why node.js scales well?
9. Can we use thread pool for javascript code? Or only nodeJs function like pbkdf2 can use the thread-pool?
10. What functions in Node.js use thread pool? (fs, crypto, depends on OS)
11. Relations of thread pool and event loop? (Thread pools tasks are `pending operations` to event loop)

**What is node.js**

---

Node.js used for building highly scalable server-side applications using JavaScript.

- Open-source server side runtime environment
- Built on Chrome's V8 JavaScript engine which internally use libUV library
- provides
  - Event driven
  - Non-blocking (asynchronous) I/O
  - cross-platform runtime environment

**Why we use node.js instead of directly using V8 and libuv?**

---

- V8
  - Allow running JavScript outside of browser
- libuv
  - Allow node js to access the underlying file system of operating system
  - Delegate networking to OS
  - Handle some part of concurrency

V8 = (30% JS + 70% C++)

libuv = 100 C++

With Node.js

- As javascript developer, we do no have to write C++ to interact and making use of `V8` and `libuv`. Node.js provide an interface, where our JS code can make use of these C++ codes.
- Node also provides a series of wrappers to use in our application like, `http module`, `fs module`, `crypto module` and `path module` etc. Most of these modules are using the functionalities from the `libuv`, internally written in C++. By making use of node, we can invoke the function in javascript and these function will call the C++ codes.

**How node.js utilize V8 and libuv? Explain with example.**

---

All the modules are implemented in the nodejs `lib` directory.

If we consider implementing a `crypto` library algorithm `pbkdf2`, we can see it invokes the function `PBKDF2` from the C++. These C++ implementations are written in `src` directory. From JavaScript, we can invoke the method from C++ using `process.bindings`. `Process.bindings` are seems to be a bridge between C++ and JavaScript. To make a C++ method available to the JavaScript world, we export a C++ method using `env->SetMethod(target, "PBKDF2", PBKDf2)`.

V8 use to translate nodejs values like boolean, functions, objects into C++ equivalence. It provides C++ definition of JavaScript concepts.

So when from our application, we call `PBKDF2` function using the `crypto` library, the JavaScript code validates the arguments and eventually the C++ code calculates the hash value.

**What is threads on computer and how it works?**

---

- When we run program in computer, we run `Process`. `Process` is an instance of computer program.
- Inside a process, there are single/multiple things called threads
- A thread contains a instruction list like get a file, read-it, execute an operation, close the file etc. These instructions inside the threads, usually executed by the CPU.
- Scheduler decides which threads will be executed in a specific instance of time.
- OS has multiple core (physical and logical) to executes threads.

**How os schedular works with threads?**

---

Usually an I/O operation requires non zero time to be completed. In a process / instance of program, there can be two threads, one to read file from hard drive and another operation on that file. OS first try to get the file from disk. This is a time consuming process. During this waiting time, a CPU can take another thread and return back to the first thread to do the rest of the works.

**What is node.js event loop? Explain from top to bottom. What is a tick in event loop?**

---

### Event Loop

Anytime we run a node.js program, it creates one thread and then run all of our codes inside that thread.

Event loop acts as a control structure to decide, what our one thread should be doing at one given time.

When we run a js file, Node first take all the codes and execute it. This is the moment we enter to the event loop.

Every time the event loop executes a cycle, in Node.js world it is called tick.

Every single time the event loop about to execute, Node does a quick check whether the loop should proceed or not for another iteration. If node decides not to run more iteration, the program close and we goes back to terminal.

Event loop continues to next iteration when `shouldContinue` method return true.

When node first goes through the code first time, it detects `pendingTimers`, `pendingOSTasks`, and `pendingOperations`.

### Tick

Every single iteration of a event loop is called tick.

```js
// javascript code is written inside the myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// New timers, tasks, operations are recorded from myFile
myFile.runContents();

function shouldContinue() {
  // Check one: Any pending setTimeout, setInterval, setImmediate?
  // Check two: Any pending OS tasks? (Like server listening to port, network calls)
  // Check three: Any pending long running operation? (Like fs module, thread pools tasks)
  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
}

// Entire body executes in one 'tick'
while (shouldContinue()) {
  // 1) Node looks at pending timers and sees if any functions are ready to be called (setTimeout, setInterval)
  // 2) Node looks at pendingOSTasks and pendingOperations and calls relevant callbacks
  // 3) Node pause the execution until,
  //   - a pendingOSTasks is done
  //   - a pendingOperation is done
  //   - a timer is about to complete
  // 4) Look at pendingTimers. Call any setImmediate (This time node does not care about setTimeout or setInterval, it only looks at those functions, registered with setImmediate)
  // 5) Handle any 'close' events
}
```

### Summary

Node.js event loop,

1. Process and execute code in index.js
2. Look for pendingTimers, OS tasks, pending tasks. If no tasks exists, exit.
3. Run setTimeout's, setInterval's
4. Run callbacks for OS tasks and thread pools pending stuff
5. Pause and wait for stuff done
6. Run setImmediate functions
7. Handle close events
8. Return to step 2

**Explain node.js multi-thread operation?**

---

### Threads

- When we run program in computer, we run `Process`. `Process` is an instance of computer program.
- Inside a process, there are single/multiple things called threads
- A thread contains a instruction list like get a file, read-it, execute an operation, close the file etc. These instructions inside the threads, usually executed by the CPU.
- Scheduler decides which threads will be executed in a specific instance of time.
- OS has multiple core (physical and logical) to executes threads.

Example of OS Scheduling:

Usually an I/O operation requires non zero time to be completed. In a process, there can be two threads, one to read file from hard drive and another operation on that file. OS first try to get the file from disk. This is a time consuming process. During this waiting time, a CPU can take another thread and return back to the first thread to do the rest of the works.

**Can we use thread pool for our js code or it is only applicable for certain node js library function?**

---

Yes, we can make use of thread pool for our regular JS code.

**What library in the node.js standard library make use of thread pool?**

---

- All the `fs` module method make use of the thread pool
- Some Crypto functions
- Functions use of thread pools varies from OS to OS

**How does thread pool fit into the event loop?**

---

Thread pools are considering pending operation to event loop

**How does low level tasks are handled in the node.js?**

---

Some low level tasks, like network call are not handled by Node.js itself or libuv. Instead, it is handled by OS itself (could be single/multiple thread).

In event loop, these tasks are considered as `pendingOSTasks`.

**Explain an example of event loop**

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
  console.log(`FS: ${Date.now() - start}ms`);
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

Explanation:

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
  console.log(`FS: ${Date.now() - start}ms`);
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

**Why node.js scales well?**
