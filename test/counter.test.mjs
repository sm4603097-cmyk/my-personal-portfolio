import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  counterBehavior,
  counterFinalText,
  counterStartText,
} from '../src/motion/counterState.ts';

const COUNTER_VALUES = ['30+', '15+', '35', '17', '6', '67'];

test('counter has a measurable observation target', () => {
  // Regression: AnimatedCounter observed an initially empty span with zero
  // layout area, so IntersectionObserver never reported it in-view and the
  // counter stayed stuck at 0. The start text is now painted into the span
  // from the very first render, so the target always has non-zero dimensions.
  for (const value of COUNTER_VALUES) {
    const start = counterStartText(value);
    assert.ok(start.length > 0, `${value}: start text must not be empty`);
    assert.match(start, /\d/, `${value}: start text must contain a digit`);
  }
});

test('counter paints from zero on initial render and on reset', () => {
  for (const value of ['35', '17', '6', '67']) {
    assert.equal(counterStartText(value), '0');
  }
  assert.equal(counterStartText('30+'), '0+');
  assert.equal(counterStartText('15+'), '0+');
});

test('entering the viewport switches to animation toward the target value', () => {
  assert.equal(counterBehavior(false, true), 'animate');
});

test('leaving the viewport resets to zero', () => {
  assert.equal(counterBehavior(false, false), 'reset');
});

test('re-entering the viewport animates again (replay semantics)', () => {
  assert.equal(counterBehavior(false, false), 'reset');
  assert.equal(counterBehavior(false, true), 'animate');
  assert.equal(counterBehavior(false, true), 'animate');
});

test('suffix such as "+" is preserved in both start and final text', () => {
  assert.equal(counterStartText('30+'), '0+');
  assert.equal(counterStartText('15+'), '0+');
  assert.equal(counterFinalText('30+'), '30+');
  assert.equal(counterFinalText('15+'), '15+');
});

test('final target values render the real numbers', () => {
  for (const value of COUNTER_VALUES) {
    assert.equal(counterFinalText(value), value);
  }
});

test('reduced motion jumps straight to a static final value', () => {
  assert.equal(counterBehavior(true, true), 'static-final');
  assert.equal(counterBehavior(true, false), 'static-final');
  assert.equal(counterFinalText('67'), '67');
});

test('non-numeric values pass through statically', () => {
  assert.equal(counterStartText('Native'), 'Native');
  assert.equal(counterFinalText('Native'), 'Native');
});

test('decimals and custom formats keep their behavior', () => {
  assert.equal(counterStartText('67', { decimals: 1 }), '0.0');
  assert.equal(counterFinalText('67', { decimals: 1 }), '67.0');

  const format = (current, final) => `${current} / ${final}`;
  assert.equal(counterStartText('441 / 441', { format }), '0 / 441');
  assert.equal(counterFinalText('441 / 441', { format }), '441 / 441');
});