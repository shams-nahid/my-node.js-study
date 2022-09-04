Worker threads create separate threads inside our application. To communicate with these worker thread, we have `postMessage` and `onMessage` methods. This `postMessage` and `onMessage` is applicable for both the worker thread and main application thread.

Usually, in libUV, a couple of methods already use the thread pool. And using worker threads, does not prevent them using their own thread. That means, creating worker thread to delegate these jobs does not make sense.
