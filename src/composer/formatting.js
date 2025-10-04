'use strict';

const palette = [
	{ id: 'red', label: 'Red' },
	{ id: 'orange', label: 'Orange' },
	{ id: 'yellow', label: 'Yellow' },
	{ id: 'green', label: 'Green' },
	{ id: 'teal', label: 'Teal' },
	{ id: 'blue', label: 'Blue' },
	{ id: 'indigo', label: 'Indigo' },
	{ id: 'purple', label: 'Purple' },
	{ id: 'pink', label: 'Pink' },
	{ id: 'gray', label: 'Gray' },
	{ id: 'black', label: 'Black' },
];

let registered = false;

module.exports = function registerComposerFormatting(Plugins) {
	if (registered) {
		return;
	}

	Plugins.hooks.register('core', {
		hook: 'filter:composer.formatting',
		method: async (payload) => {
			if (!payload || !Array.isArray(payload.options)) {
				return payload;
			}

			const alreadyPresent = payload.options.some((option) => {
				if (!option || !Array.isArray(option.dropdownItems)) {
					return false;
				}
				return option.dropdownItems.some(item => item && typeof item.name === 'string' && item.name.startsWith('textcolor:'));
			});
			if (alreadyPresent) {
				return payload;
			}

			const dropdownItems = palette.map(color => ({
				name: `textcolor:${color.id}`,
				text: color.label,
				className: `fa fa-circle text-color-icon text-color-${color.id}`,
			}));
			dropdownItems.push({
				name: 'textcolor:clear',
				text: 'Clear color',
				className: 'fa fa-eraser text-color-icon text-color-clear',
			});

			const visibility = payload.defaultVisibility || {
				mobile: true,
				desktop: true,
				main: true,
				reply: true,
			};

			const colorDropdown = {
				title: '[[modules:composer.formatting.color]]',
				className: 'fa fa-paint-brush',
				dropdownItems,
				visibility,
			};

			payload.options.splice(2, 0, colorDropdown);
			return payload;
		},
	});

	registered = true;
};