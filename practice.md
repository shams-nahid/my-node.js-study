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
  - Event driven (**What does it mean?**)
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

**Explain clustering with example**

There are scenario, where we have to do time consuming work in the event loop. Since event loop is single threaded, any time consuming operation will pause the loop for further I/O for a certain period of time. There are two ways, we can somehow mitigate the performance impact,

- Cluster mode
- Worker threads

### Clustering

Consider an example, in node server, we receive a request, and have tons of computation before sending the response. This computation task is in javascript and is not delegate to the OS or thread pool. During this computation, the event loop can not take next request.

```js
const doSomeWork = duration => {
  const start = Date.now();
  while (Date.now() - start < duration) {}
};

app.get('/', (req, res) => {
  doSomeWork(5000);
  res.send('Hi there');
});

app.listen(8000);
```

To overcome the issue, we can introduce the clustering. With clustering, there is a parent process, we called cluster manager.

Cluster manager,

- Monitor health of the instances
- Can start/stop/restart the instances
- Can send data to the instances

Cluster manager does not Handle request or Fetch data from DB.

Without clustering, when we run a node.js app, it went through the `index.js` and create an instance to handle incoming request. With clustering, initially a instance called `Cluster` is created. Then the `cluster` is responsible for creating child instance, using `child.fork()`. These child instances are responsible for handling the incoming request.

```js
const cluster = require('cluster');

// is file being executed in cluster/master mode
if (cluster.isMaster) {
  cluster.fork(); // Run `index.js` in child mode
  cluster.fork(); // Run `index.js` in child mode
} else {
  // This is a child server and will run as server
  const doSomeWork = duration => {
    const start = Date.now();
    while (Date.now() - start < duration) {}
  };

  app.get('/', (req, res) => {
    doSomeWork(5000);
    res.send('Hi there');
  });

  app.listen(8000);
}
```

### Advantage of Clustering

Lets consider the express server route,

```js
const doSomeWork = duration => {
  const start = Date.now();
  while (Date.now() - start < duration) {}
};

app.get('/fast', (req, res) => {
  res.send('Fast route');
});

app.get('/slow', (req, res) => {
  doSomeWork();
  res.send('Fast route');
});
```

With this code, if we call, `/slow` and almost immediately `/fast`, the following scenario happen,

- We first hit the `/slow` and the event loop will not process any further request in next 5 seconds.
- Then the `/fast` route come to play and get executed.

It appears, even the `/fast` is super fast but due to event loop in single thread and previous route is taking 5 seconds, it can not executed immediately.

In this case, we can make use of the clustering as follows,

```js
if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
} else {
  const doSomeWork = duration => {
    const start = Date.now();
    while (Date.now() - start < duration) {}
  };

  app.get('/fast', (req, res) => {
    res.send('Fast route');
  });

  app.get('/slow', (req, res) => {
    doSomeWork();
    res.send('Fast route');
  });
}
```

Here, with clustering, we make two of the node.js event loop instances. In this case, when we call `/slow` and almost immediately `/fast`,

- Fist event loop instance will take care of `/slow`
- The second event loop instance will take care of `/fast` while the `/slow` is still being proceed by first event loop

> So this is a practical way, where clustering can play a huge benefit inside the app. When there are some route in app, take longer to process and some other route which are fast, using clustering, we can spin up multiple server and can achieve faster response time.

**What are the limitations of clustering?**

### Limitation of Clustering

There are a couple of corner cases in clustering which we should be concerned.

Before we get into the example lets make some assumption

- The machine, running the code, has two core (Duel core machine)
- The hashing algorithm requires 1 seconds to be executed in one single thread

Now, consider the following code,

```js
process.env.UV_THREADPOOL_SIZE = 1;

if (cluster.isMaster) {
  cluster.fork();
} else {
  app.get('/', (req, res) => {
    runHash(() => {
      return res;
    });
  });
}
```

In this case, when we send 1 request, it will be executed in 1 seconds and the response time will be same.

Consider making 2 request concurrently. Since there is only one thread, first hash will take 1 second and then the 2nd hashing start working. So the second request will be completed after 2 seconds.

How about, we make use of clustering by making 2 children here,

```js
process.env.UV_THREADPOOL_SIZE = 1;

if (cluster.isMaster) {
  cluster.fork(); // 1st child
  cluster.fork(); // 2nd child
} else {
  app.get('/', (req, res) => {
    runHash(() => {
      return res;
    });
  });
}
```

Now when we send 2 request, concurrently, both two child server take one and execute in 1 seconds in total. This is the place, clustering come to place.

Since using 2 children server can optimize operation, can we add more and more children and get more optimized result? How about making 6 children?

```js
process.env.UV_THREADPOOL_SIZE = 1;

if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  app.get('/', (req, res) => {
    runHash(() => {
      return res;
    });
  });
}
```

Now we have 6 children and we will send 6 requests concurrently. Surprisingly, we can notice, all the hashing will be completed around 3.5 ~ 4 seconds.

This is because, we assume out machine has only 2 threads and can not process more at a single time. So all 6 hashing try to be resolved in a same time and the limited 2 threads do partial work on all. This is why, it even take more time.

So to get optimized response, it is useful to adjust child server numbers according to the number of cores in server.

**How to handle clustering in your application?**

Instead of running clustering manually, in production, better handle using `pm2`.

`PM2` is a cluster management tools can handle the clustering very efficiently.

- Can spin up child server according to the logical core of the server
- Can spin up child server by specify the number
- Can inspect, monitor and log the running instances
- Can start/end/restart the child instances

**Tell me about worker threads**

Worker threads create separate threads inside our application. To communicate with these worker thread, we have `postMessage` and `onMessage` methods. This `postMessage` and `onMessage` is applicable for both the worker thread and main application thread.

Usually, in libUV, a couple of methods already use the thread pool. And using worker threads, does not prevent them using their own thread. That means, creating worker thread to delegate these jobs does not make sense.
