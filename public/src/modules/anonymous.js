'use strict';

define('anonymous', [], function () {
	const Anonymous = {};

	Anonymous.init = function () {
		// Anonymous posting functionality is now handled by compose.js
		// This module is kept for backwards compatibility
		console.log('Anonymous posting module loaded - functionality handled by compose.js');
	};

	return Anonymous;
});