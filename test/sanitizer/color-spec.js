'use strict';
const assert = require('assert');
const sanitizer = require('../../src/sanitizer');

describe('sanitizer for colored spans', function () {
	it('allows span.text-color-xxx', function () {
		const input = '<span class="text-color-red">X</span>';
		const out = sanitizer.clean(input);
		assert.strictEqual(out, input);
	});

	it('strips inline style', function () {
		const input = '<span style="color:red">X</span>';
		const out = sanitizer.clean(input);
		assert.strictEqual(out, '<span>X</span>');
	});

	it('rejects unknown class', function () {
		const input = '<span class="text-color-bad">X</span>';
		const out = sanitizer.clean(input);
		assert.strictEqual(out, '<span>X</span>');
	});

	it('keeps only allowed class when multiple classes are present', function () {
		const input = '<span class="foo text-color-blue bar">X</span>';
		const out = sanitizer.clean(input);
		assert.strictEqual(out, '<span class="text-color-blue">X</span>');
	});

	it('drops disallowed style even if an allowed class is present', function () {
		const input = '<span class="text-color-green" style="color:#00ff00">X</span>';
		const out = sanitizer.clean(input);
		assert.strictEqual(out, '<span class="text-color-green">X</span>');
	});

	it('passes through plain text unchanged', function () {
		const input = 'No HTML here';
		const out = sanitizer.clean(input);
		assert.strictEqual(out, input);
	});
});
