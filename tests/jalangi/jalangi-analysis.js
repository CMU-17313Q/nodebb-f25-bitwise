/**
 * Jalangi2 Dynamic Analysis Script
 * This script performs runtime analysis of JavaScript code execution
 */

(function (sandbox) {
    function MyAnalysis() {
        // Statistics tracking
        this.stats = {
            functionCalls: 0,
            conditionals: 0,
            literals: 0,
            variables: 0,
            binaryOperations: 0,
            unaryOperations: 0,
            reads: 0,
            writes: 0,
            returns: 0,
            exceptions: 0
        };

        // Track function invocations
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            this.stats.functionCalls++;
        };

        // Track conditional expressions
        this.conditional = function (iid, result) {
            this.stats.conditionals++;
            return { result: result };
        };

        // Track literal values
        this.literal = function (iid, val, hasGetterSetter) {
            this.stats.literals++;
            return { result: val };
        };

        // Track variable reads
        this.read = function (iid, name, val, isGlobal, isScriptLocal) {
            this.stats.reads++;
            return { result: val };
        };

        // Track variable writes
        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {
            this.stats.writes++;
            return { result: val };
        };

        // Track binary operations
        this.binary = function (iid, op, left, right) {
            this.stats.binaryOperations++;
        };

        // Track unary operations
        this.unary = function (iid, op, left) {
            this.stats.unaryOperations++;
        };

        // Track return statements
        this.return_ = function (iid, val) {
            this.stats.returns++;
            return { result: val };
        };

        // Track exceptions
        this.throw_ = function (iid, val) {
            this.stats.exceptions++;
            return { result: val };
        };

        // End execution callback - print statistics
        this.endExecution = function () {
            console.log('\n' + '='.repeat(80));
            console.log('JALANGI2 DYNAMIC ANALYSIS RESULTS');
            console.log('='.repeat(80));
            console.log('\nExecution Statistics:');
            console.log('  Function Calls:       ', this.stats.functionCalls);
            console.log('  Conditional Branches: ', this.stats.conditionals);
            console.log('  Literal Values:       ', this.stats.literals);
            console.log('  Variable Reads:       ', this.stats.reads);
            console.log('  Variable Writes:      ', this.stats.writes);
            console.log('  Binary Operations:    ', this.stats.binaryOperations);
            console.log('  Unary Operations:     ', this.stats.unaryOperations);
            console.log('  Return Statements:    ', this.stats.returns);
            console.log('  Exceptions Thrown:    ', this.stats.exceptions);
            console.log('\n' + '='.repeat(80));
            console.log('Total Dynamic Events Tracked: ',
                Object.values(this.stats).reduce((a, b) => a + b, 0));
            console.log('='.repeat(80) + '\n');
        };
    }

    sandbox.analysis = new MyAnalysis();
})(J$);