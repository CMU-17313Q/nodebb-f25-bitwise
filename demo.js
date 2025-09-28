// This file is a temporary script to demonstrate the functionality
// of the `src/posts/api.js` file by running its demo function
// in a self-contained environment.

// ====================================================================
// Mock Objects & Database
// In a real NodeBB environment, these would be provided by the core system.
// ====================================================================

// A mock database to simulate posts.
// Initially, post:1 has isOfficialAnswer set to false, and post:2 has no field.
const mockDb = {
    'post:1': {
        pid: '1',
        uid: '123',
        content: 'This is a mock post with a default flag.',
        isOfficialAnswer: false,
    },
    'post:2': {
        pid: '2',
        uid: '456',
        content: 'This is another mock post with no flag yet.',
    },
};

// Mock `posts` object to simulate database interactions.
// In a real NodeBB, these would be functions like `posts.getPostData` from a database module.
const posts = {
    /**
     * Retrieves post data from the mock database.
     * @param {string} pid - The post ID.
     * @returns {Promise<object | null>} The post object or null if not found.
     */
    async getPostData(pid) {
        return mockDb[`post:${pid}`] || null;
    },

    /**
     * Sets a single field for a post in the mock database.
     * @param {string} pid - The post ID.
     * @param {string} field - The field to set.
     * @param {*} value - The value to set.
     * @returns {Promise<void>}
     */
    async setPostField(pid, field, value) {
        if (mockDb[`post:${pid}`]) {
            mockDb[`post:${pid}`][field] = value;
            console.log(`[DB MOCK] Updated post:${pid} - set field '${field}' to '${value}'`);
        }
    },
};

// Mock `helpers` object to simulate API response handling.
const helpers = {
    /**
     * Sends a successful JSON response.
     * @param {object} res - The response object.
     * @param {object} payload - The JSON payload to send.
     */
    status(res, payload) {
        // Direct logging to avoid winston issues.
        console.log(`[API RESPONSE] Status: 200 OK. Payload: ${JSON.stringify(payload, null, 2)}`);
    },

    /**
     * Sends a 404 Not Found response.
     * @param {object} res - The response object.
     */
    notFound(res) {
        // Direct logging to avoid winston issues.
        console.log(`[API RESPONSE] Status: 404 Not Found.`);
    },
};

// ====================================================================
// Core API Endpoint Logic
// This function would be the handler for the POST /api/v1/posts/:pid/toggleOfficial route.
// ====================================================================

/**
 * Toggles the `isOfficialAnswer` flag for a given post.
 *
 * @param {object} req - The request object (with `params`).
 * @param {object} res - The response object.
 */
async function toggleOfficial(req, res) {
    // 1. Validate the incoming post ID (pid).
    const pid = req.params.pid;
    if (!pid) {
        return helpers.notFound(res);
    }

    // 2. Retrieve the post from the database.
    const post = await posts.getPostData(pid);

    // 3. If the post doesn't exist, return a 404.
    if (!post) {
        return helpers.notFound(res);
    }

    // 4. Get the current status, defaulting to false if the field is not present.
    const currentStatus = !!post.isOfficialAnswer;

    // 5. Toggle the value.
    const newStatus = !currentStatus;

    // 6. Save the updated post back to the database.
    await posts.setPostField(pid, 'isOfficialAnswer', newStatus);

    // 7. Return a success message with the new status.
    helpers.status(res, {
        success: true,
        message: 'Official answer flag toggled successfully.',
        newStatus: newStatus,
    });
}

// ====================================================================
// Demonstration
// This section simulates a few calls to the toggleOfficial function
// to show its behavior.
// ====================================================================

async function runDemo() {
    console.log("--- Initial State of Mock Posts ---");
    console.log("Post 1:", await posts.getPostData('1'));
    console.log("Post 2:", await posts.getPostData('2'));
    console.log("\n");

    // Simulate toggling post ID 1
    console.log("--- Toggling Post 1 (current status: false) ---");
    await toggleOfficial({ params: { pid: '1' } }, {});
    console.log("\n--- State After First Toggle ---");
    console.log("Post 1:", await posts.getPostData('1'));
    console.log("\n");

    // Simulate toggling post ID 2 (which has no flag initially)
    console.log("--- Toggling Post 2 (current status: undefined) ---");
    await toggleOfficial({ params: { pid: '2' } }, {});
    console.log("\n--- State After First Toggle ---");
    console.log("Post 2:", await posts.getPostData('2'));
    console.log("\n");

    // Simulate toggling post ID 1 again
    console.log("--- Toggling Post 1 again (current status: true) ---");
    await toggleOfficial({ params: { pid: '1' } }, {});
    console.log("\n--- State After Second Toggle ---");
    console.log("Post 1:", await posts.getPostData('1'));
    console.log("\n");

    // Simulate hitting a non-existent post ID
    console.log("--- Attempting to toggle non-existent post 999 ---");
    await toggleOfficial({ params: { pid: '999' } }, {});
}

// Run the demo to show the functionality.
runDemo();
