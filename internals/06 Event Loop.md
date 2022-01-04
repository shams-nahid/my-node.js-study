### Event Loop

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
