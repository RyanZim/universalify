'use strict'

exports.fromCallback = function (fn) {
  return Object.defineProperty(function (...args) {
    if (typeof args[args.length - 1] === 'function') fn.apply(this, args)
    else {
      // Capture stack trace of where the promise was created in case it rejects.
      let caller_stack = new Error("Failing function was called from here").stack
      return new Promise((resolve, reject) => {
        fn.call(
          this,
          ...args,
          (err, res) => {
            if (err != null) {
              if (err instanceof Error && typeof err.stack === 'string') {
                // It is safe to improve the error's stack trace with
                // information about where the Promise was created and where
                // the err was passed from.
                let e = new Error("Callback-based function called back with an error")
                err.stack += "\n" + e.stack + "\n" + caller_stack
              }
              reject(err)
            } else {
              resolve(res)
            }
          }
        )
      })
    }
  }, 'name', { value: fn.name })
}

exports.fromPromise = function (fn) {
  return Object.defineProperty(function (...args) {
    const cb = args[args.length - 1]
    if (typeof cb !== 'function') return fn.apply(this, args)
    else fn.apply(this, args.slice(0, -1)).then(r => cb(null, r), cb)
  }, 'name', { value: fn.name })
}
