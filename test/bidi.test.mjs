import { test } from 'node:test';
import assert from 'node:assert/strict';

import { splitMetricSegments } from '../src/utils/bidi.ts';

test('leading numeric tokens are extracted into their own segment', () => {
  const segments = splitMetricSegments('35 نموذجاً لقاعدة البيانات · 17 ترحيلاً');
  assert.equal(segments.length, 2);
  assert.deepEqual(segments[0], { number: '35', text: 'نموذجاً لقاعدة البيانات' });
  assert.deepEqual(segments[1], { number: '17', text: 'ترحيلاً' });
});

test('numeric tokens with slashes stay intact', () => {
  const segments = splitMetricSegments('441/441 اختبار وحدة بنجاح · 104/104 اختبار E2E بنجاح');
  assert.deepEqual(segments[0], { number: '441/441', text: 'اختبار وحدة بنجاح' });
  assert.deepEqual(segments[1], { number: '104/104', text: 'اختبار E2E بنجاح' });
});

test('segments without a leading number pass through untouched', () => {
  const segments = splitMetricSegments('محرك تظليل الكود · تثبيت شاقولي');
  assert.deepEqual(segments, [
    { number: null, text: 'محرك تظليل الكود' },
    { number: null, text: 'تثبيت شاقولي' },
  ]);
});

test('trailing numbers are left in place (not treated as leading)', () => {
  const segments = splitMetricSegments('فحص متوافق مع OWASP 100%');
  assert.deepEqual(segments, [{ number: null, text: 'فحص متوافق مع OWASP 100%' }]);
});

test('english metrics with unit prefixes are isolated too', () => {
  const segments = splitMetricSegments('24/7 Availability · Edge CDN');
  assert.deepEqual(segments[0], { number: '24/7', text: 'Availability' });
  assert.deepEqual(segments[1], { number: null, text: 'Edge CDN' });
});

test('empty input yields a single text-less segment', () => {
  assert.deepEqual(splitMetricSegments(''), [{ number: null, text: '' }]);
});