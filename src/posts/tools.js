'use strict';

const privileges = require('../privileges');

module.exports = function (Posts) {
	Posts.tools = {};

	Posts.tools.delete = async function (uid, pid) {
		return await togglePostDelete(uid, pid, true);
	};

	Posts.tools.restore = async function (uid, pid) {
		return await togglePostDelete(uid, pid, false);
	};

	Posts.tools.markOfficial = async function (uid, pid) {
		return await togglePostOfficial(uid, pid, true);
	};

	Posts.tools.unmarkOfficial = async function (uid, pid) {
		return await togglePostOfficial(uid, pid, false);
	};

	Posts.tools.toggleOfficial = async function (uid, pid) {
		const postData = await Posts.getPostData(pid);
		if (!postData) {
			throw new Error('[[error:no-post]]');
		}
		return await togglePostOfficial(uid, pid, !postData.official);
	};

	async function togglePostDelete(uid, pid, isDelete) {
		const [postData, canDelete] = await Promise.all([
			Posts.getPostData(pid),
			privileges.posts.canDelete(pid, uid),
		]);
		if (!postData) {
			throw new Error('[[error:no-post]]');
		}

		if (postData.deleted && isDelete) {
			throw new Error('[[error:post-already-deleted]]');
		} else if (!postData.deleted && !isDelete) {
			throw new Error('[[error:post-already-restored]]');
		}

		if (!canDelete.flag) {
			throw new Error(canDelete.message);
		}
		let post;
		if (isDelete) {
			Posts.clearCachedPost(pid);
			post = await Posts.delete(pid, uid);
		} else {
			post = await Posts.restore(pid, uid);
			post = await Posts.parsePost(post);
		}
		return post;
	}

	async function togglePostOfficial(uid, pid, isOfficial) {
		const [postData, canMarkOfficial] = await Promise.all([
			Posts.getPostData(pid),
			privileges.posts.canMarkOfficial(pid, uid),
		]);

		if (!postData) {
			throw new Error('[[error:no-post]]');
		}

		if (postData.official && isOfficial) {
			throw new Error('[[error:post-already-official]]');
		} else if (!postData.official && !isOfficial) {
			throw new Error('[[error:post-not-official]]');
		}

		if (!canMarkOfficial) {
			throw new Error('[[error:no-privileges]]');
		}

		await Posts.setPostField(pid, 'official', isOfficial ? 1 : 0);

		const plugins = require('../plugins');
		await plugins.hooks.fire('action:post.officialToggled', {
			pid: pid,
			uid: uid,
			official: isOfficial,
		});

		const updatedPost = await Posts.getPostData(pid);
		return await Posts.parsePost(updatedPost);
	}
};
