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
  // Check two: Any pending OS tasks? (Like server listening to port)
  // Check three: Any pending long running operation? (Like fs module)
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
2. Look for times, OS tasks, thread pool. If no tasks exists, exit.
3. Run setTimeout's, setInterval's
4. Run callbacks for OS tasks and thread pools pending stuff
5. Pause and wait for stuff done
6. Run setImmediate functions
7. Handle close events
8. Return to step 2


