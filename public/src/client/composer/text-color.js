'use strict';

define('forum/composer/text-color', [
	'composer/formatting',
	'composer/controls',
], function (formatting, controls) {
	const palette = [
		{ id: 'red', value: '#d92b2b' },
		{ id: 'orange', value: '#e96310' },
		{ id: 'yellow', value: '#e5b70a' },
		{ id: 'green', value: '#1f9d55' },
		{ id: 'teal', value: '#1aa39a' },
		{ id: 'blue', value: '#2474b5' },
		{ id: 'indigo', value: '#5856d6' },
		{ id: 'purple', value: '#a32cc4' },
		{ id: 'pink', value: '#d63384' },
		{ id: 'gray', value: '#6c757d' },
		{ id: 'black', value: '#111111' },
	];

	palette.forEach((color) => {
		formatting.addButtonDispatch(`textcolor:${color.id}`, function (textarea, start, end, event) {
			if (event) {
				event.preventDefault();
			}
			applyColor(color.value, textarea, start, end);
		});
	});

	formatting.addButtonDispatch('textcolor:clear', function (textarea, start, end, event) {
		if (event) {
			event.preventDefault();
		}
		clearColor(textarea, start, end);
	});

	function applyColor(colorValue, textarea, start, end) {
		if (!textarea) {
			return;
		}
		const openTag = `[color=${colorValue}]`;
		const closeTag = '[/color]';

		if (start === end) {
			const block = findBlockContainingRange(textarea.value, start, start);
			if (block) {
				const cleanInner = stripColorTags(textarea.value.slice(block.contentStart, block.contentEnd));
				replaceRange(
					textarea,
					block.blockStart,
					block.blockEnd,
					`${openTag}${cleanInner}${closeTag}`,
					openTag.length,
					openTag.length + cleanInner.length
				);
				return;
			}
			replaceRange(textarea, start, end, `${openTag}${closeTag}`, openTag.length, openTag.length);
			return;
		}

		const selected = stripColorTags(textarea.value.slice(start, end));
		replaceRange(textarea, start, end, `${openTag}${selected}${closeTag}`, openTag.length, openTag.length + selected.length);
	}

	function clearColor(textarea, start, end) {
		if (!textarea) {
			return;
		}
		const value = textarea.value;

		if (start !== end) {
			const cleaned = stripColorTags(value.slice(start, end));
			replaceRange(textarea, start, end, cleaned, 0, cleaned.length);
			return;
		}

		const block = findBlockContainingRange(value, start, start);
		if (!block) {
			return;
		}
		const content = value.slice(block.contentStart, block.contentEnd);
		const caretOffset = clamp(start - block.contentStart, 0, content.length);
		replaceRange(textarea, block.blockStart, block.blockEnd, content, caretOffset, caretOffset);
	}

	const COLOR_TAG_PATTERN = /\[color=([^\]]+)\]|\[\/color\]/gi;
	const COLOR_TAG_STRIP = /\[\/?color(?:=[^\]]+)?\]/gi;

	function stripColorTags(text) {
		return String(text || '').replace(COLOR_TAG_STRIP, '');
	}

	function findBlockContainingRange(value, start, end) {
		COLOR_TAG_PATTERN.lastIndex = 0;
		const stack = [];
		let match;
		const rangeStart = Math.min(start, end);
		const rangeEnd = Math.max(start, end);

		while ((match = COLOR_TAG_PATTERN.exec(value)) !== null) {
			const token = match[0];
			if (token.startsWith('[color=')) {
				stack.push({ index: match.index, length: token.length });
				continue;
			}
			const opening = stack.pop();
			if (!opening) {
				continue;
			}
			const openEnd = opening.index + opening.length;
			const blockEnd = COLOR_TAG_PATTERN.lastIndex;
			const contentStart = openEnd;
			const contentEnd = match.index;
			if (rangeStart >= contentStart && rangeEnd <= contentEnd) {
				return {
					blockStart: opening.index,
					blockEnd,
					contentStart,
					contentEnd,
				};
			}
		}
		return null;
	}

	function replaceRange(textarea, start, end, replacement, selectionStartOffset, selectionEndOffset) {
		const relativeStart = clamp(selectionStartOffset, 0, replacement.length);
		const relativeEnd = clamp(selectionEndOffset, relativeStart, replacement.length);
		controls.updateTextareaSelection(textarea, start, end);
		controls.replaceSelectionInTextareaWith(textarea, replacement);
		controls.updateTextareaSelection(textarea, start + relativeStart, start + relativeEnd);
	}

	function clamp(number, min, max) {
		return Math.min(Math.max(number, min), max);
	}
});