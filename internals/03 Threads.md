### Threads

- When we run program in computer, we run `Process`. `Process` is an instance of computer program.
- Inside a process, there are single/multiple things called threads
- A thread contains a instruction list like get a file, read-it, execute an operation, close the filet etc. These instructions inside the threads, usually executed by the CPU.
- Scheduler decides which threads will be executed in a specific instance of time.
- OS has multiple core (physical and logical) to executes threads.

Example of OS Scheduling:

Usually an I/O operation requires non zero time to be completed. In a thread, there can be two threads, one to read file from hard drive and another operation on that file. OS first try to get the file from disk. This is a time consuming process. During this waiting time, a CPU can take another thread and return back to the first thread to do the rest of the works.
