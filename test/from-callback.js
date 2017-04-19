'use strict'
const test = require('tape')
const universalify = require('..')

const fn = universalify.fromCallback(function (a, b, cb) {
  setTimeout(() => cb(null, [this, a, b]), 15)
})

const errFn = universalify.fromCallback(function (cb) {
  setTimeout(() => cb(new Error('test')), 15)
})

test('callback function works with callbacks', t => {
  t.plan(4)
  fn.call({a: 'a'}, 1, 2, (err, arr) => {
    t.ifError(err, 'should not error')
    t.is(arr[0].a, 'a')
    t.is(arr[1], 1)
    t.is(arr[2], 2)
    t.end()
  })
})

test('callback function works with promises', t => {
  t.plan(3)
  fn.call({a: 'a'}, 1, 2)
  .then(arr => {
    t.is(arr[0].a, 'a')
    t.is(arr[1], 1)
    t.is(arr[2], 2)
    t.end()
  })
  .catch(t.end)
})

test('callback function error works with callbacks', t => {
  t.plan(2)
  errFn(err => {
    t.assert(err, 'should error')
    t.is(err.message, 'test')
    t.end()
  })
})

test('callback function error works with promises', t => {
  t.plan(2)
  errFn()
  .then(arr => t.end('Promise should not resolve'))
  .catch(err => {
    t.assert(err, 'should error')
    t.is(err.message, 'test')
    t.end()
  })
})

test('fromCallback() sets correct .name', t => {
  t.plan(1)
  const res = universalify.fromCallback(function hello () {})
  t.is(res.name, 'hello')
  t.end()
})
