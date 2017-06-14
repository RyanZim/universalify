# universalify

[![Travis branch](https://img.shields.io/travis/RyanZim/universalify/master.svg)](https://travis-ci.org/RyanZim/universalify)

Make a callback- or promise-based function support both promises and callbacks.

Uses the native promise implementation.

## Installation

```bash
npm install universalify
```

## API

### `universalify.fromCallback(fn)`

Takes a callback-based function to universalify, and returns the universalified  function.

Function must take a callback as the last parameter that will be called with the signature `(error, result)`. `universalify` does not support calling the callback with more than three arguments, and does not ensure that the callback is only called once.

```js
function callbackFn (n, cb) {
  setTimeout(() => cb(null, n), 15)
}

const fn = universalify.fromCallback(callbackFn)

// Works with Promises:
fn('Hello World!')
.then(result => console.log(result)) // -> Hello World!
.catch(error => console.error(error))

// Works with Callbacks:
fn('Hi!', (error, result) => {
  if (error) return console.error(error)
  console.log(result)
  // -> Hi!
})
```

### `universalify.fromPromise(fn)`

Takes a promise-based function to universalify, and returns the universalified  function.

Function must return a valid JS promise. `universalify` does not ensure that a valid promise is returned.

```js
function promiseFn (n) {
  return new Promise(resolve => {
    setTimeout(() => resolve(n), 15)
  })
}

const fn = universalify.fromPromise(promiseFn)

// Works with Promises:
fn('Hello World!')
.then(result => console.log(result)) // -> Hello World!
.catch(error => console.error(error))

// Works with Callbacks:
fn('Hi!', (error, result) => {
  if (error) return console.error(error)
  console.log(result)
  // -> Hi!
})
```

### `universalify.Promise`

Exposes the Promise implementation. Defaults to `global.Promise`.

```js
universalify.Promise = require('your-promise-library')
```

## License

MIT
