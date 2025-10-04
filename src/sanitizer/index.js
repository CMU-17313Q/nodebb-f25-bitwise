'use strict';

const sanitizeHtml = require('sanitize-html');

// allowlist for text color classes
const COLOR_CLASS_RE = /^text-color-(black|gray|red|orange|yellow|lime|green|teal|cyan|blue|indigo|violet)$/;

const allowedTags = ['a', 'b', 'i', 'u', 'em', 'strong', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'p', 'br', 'span'];

const allowedAttributes = {
	a: ['href', 'name', 'target', 'rel'],
	span: ['class'],
};

function allowedClasses(tag, cls) {
	if (tag !== 'span') return true; // no restrictions on other tags’ classes
	return COLOR_CLASS_RE.test(cls);
}

function clean(input) {
	return sanitizeHtml(input, {
		allowedTags,
		allowedAttributes,
		// Disallow styles globally
		allowedStyles: {},
		// Filter classes
		transformTags: {
			span: (tagName, attribs) => {
				if (!attribs || !attribs.class) {
					return { tagName, attribs: {} };
				}
				// keep only classes that pass the allow-list for span
				const kept = attribs.class
					.split(/\s+/)
					.filter(c => allowedClasses('span', c))
					.join(' ');
				const out = {};
				if (kept) out.class = kept;
				return { tagName, attribs: out };
			},
		},
		// Strip unknown attributes and tags not in the list
		nonTextTags: sanitizeHtml.defaults.nonTextTags,
		// Allow protocol-relative and https links, etc.
		allowedSchemesByTag: { a: ['http', 'https', 'mailto'] },
	});
}

module.exports = { clean };
