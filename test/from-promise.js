'use strict'
const test = require('tape')
const universalify = require('..')

const fn = universalify.fromPromise(function (a, b, cb) {
  return new Promise(resolve => {
    setTimeout(() => resolve([this, a, b]), 15)
  })
})

const errFn = universalify.fromPromise(function () {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('test')), 15)
  })
})

test('promise function works with callbacks', t => {
  t.plan(4)
  fn.call({a: 'a'}, 1, 2, (err, arr) => {
    t.ifError(err, 'should not error')
    t.is(arr[0].a, 'a')
    t.is(arr[1], 1)
    t.is(arr[2], 2)
    t.end()
  })
})

test('promise function works with promises', t => {
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

test('promise function error works with callbacks', t => {
  t.plan(2)
  errFn(err => {
    t.assert(err, 'should error')
    t.is(err.message, 'test')
    t.end()
  })
})

test('promise function error works with promises', t => {
  t.plan(2)
  errFn()
  .then(arr => t.end('Promise should not resolve'))
  .catch(err => {
    t.assert(err, 'should error')
    t.is(err.message, 'test')
    t.end()
  })
})
