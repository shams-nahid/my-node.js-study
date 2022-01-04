### Module Implementation

All the modules are implemented in the nodejs `lib` directory. If we consider implementing a `crypto` library algorithm `pbkdf2`, we can see it invokes the function `PBKDF2` from the C++. These C++ implementations are written in `src` directory. From JavaScript, we can invoke the method from C++ using `process.bindings`. `Process.bindings` are seems to be a bridge between C++ and JavaScript. To make a C++ method available to the JavaScript world, we export a C++ method using `env->SetMethod(target, "PBKDF2", PBKDf2)`.

V8 use to translate nodejs values like boolean, functions, objects into C++ equivalence. It provides C++ definition of JavaScript concepts.

So when from our application, we call `PBKDF2` function using the `crypto` library, the JavaScript code validates the arguments and eventually the C++ code calculates the hash value.
