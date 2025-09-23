'use strict';

const hooks = module.exports;

hooks.addOfficialBadgeToPostData = function (data) {
	if (data && data.posts) {
		data.posts.forEach(function (post) {
			if (post && post.official) {
				// Ensure the official badge is available in the post data for templates
				post.displayOfficialBadge = true;
			}
		});
	}
	return data;
};

hooks.addOfficialBadgeToSinglePost = function (data) {
	if (data && data.post && data.post.official) {
		data.post.displayOfficialBadge = true;
	}
	return data;
};