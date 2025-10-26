/**
 * Sample code for Jalangi dynamic analysis
 * This file will be instrumented and analyzed at runtime
 */

// Function with conditionals
function validateUser(username, password) {
    if (!username || username.length < 3) {
        return { valid: false, error: 'Username too short' };
    }

    if (!password || password.length < 8) {
        return { valid: false, error: 'Password too short' };
    }

    return { valid: true };
}

// Function with loops and operations
function calculateSum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

// Function with exception handling
function divideNumbers(a, b) {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
}

// Execute functions to generate dynamic analysis data
console.log('Testing validateUser...');
console.log(validateUser('admin', 'password123'));
console.log(validateUser('ab', 'short'));

console.log('\nTesting calculateSum...');
console.log(calculateSum([1, 2, 3, 4, 5]));
console.log(calculateSum([10, 20, 30]));

console.log('\nTesting divideNumbers...');
try {
    console.log(divideNumbers(10, 2));
    console.log(divideNumbers(10, 0));
} catch (e) {
    console.log('Caught exception:', e.message);
}

// Object operations
var user = {
    name: 'John',
    age: 30,
    email: 'john@example.com'
};

console.log('\nUser object:', user.name, user.age);