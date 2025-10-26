J$.iids = {"nBranches":12,"originalCodeFileName":"/workspaces/nodebb-f25-bitwise/tests/jalangi/jalangi-test-sample.js","instrumentedCodeFileName":"/workspaces/nodebb-f25-bitwise/tests/jalangi/jalangi-test-sample_jalangi_.js"};
jalangiLabel3:
    while (true) {
        try {
            J$.Se(1201, '/workspaces/nodebb-f25-bitwise/tests/jalangi/jalangi-test-sample_jalangi_.js', '/workspaces/nodebb-f25-bitwise/tests/jalangi/jalangi-test-sample.js');
            function validateUser(username, password) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(185, arguments.callee, this, arguments);
                            arguments = J$.N(193, 'arguments', arguments, 4);
                            username = J$.N(201, 'username', username, 4);
                            password = J$.N(209, 'password', password, 4);
                            if (J$.X1(1265, J$.C(16, J$.C(8, J$.U(10, '!', J$.R(9, 'username', username, 0))) ? J$._() : J$.B(18, '<', J$.G(25, J$.R(17, 'username', username, 0), 'length', 0), J$.T(33, 3, 22, false), 0)))) {
                                return J$.X1(73, J$.Rt(65, J$.T(57, {
                                    valid: J$.T(41, false, 23, false),
                                    error: J$.T(49, 'Username too short', 21, false)
                                }, 11, false)));
                            }
                            if (J$.X1(1273, J$.C(32, J$.C(24, J$.U(26, '!', J$.R(81, 'password', password, 0))) ? J$._() : J$.B(34, '<', J$.G(97, J$.R(89, 'password', password, 0), 'length', 0), J$.T(105, 8, 22, false), 0)))) {
                                return J$.X1(145, J$.Rt(137, J$.T(129, {
                                    valid: J$.T(113, false, 23, false),
                                    error: J$.T(121, 'Password too short', 21, false)
                                }, 11, false)));
                            }
                            return J$.X1(177, J$.Rt(169, J$.T(161, {
                                valid: J$.T(153, true, 23, false)
                            }, 11, false)));
                        } catch (J$e) {
                            J$.Ex(1281, J$e);
                        } finally {
                            if (J$.Fr(1289))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            function calculateSum(arr) {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(393, arguments.callee, this, arguments);
                            arguments = J$.N(401, 'arguments', arguments, 4);
                            arr = J$.N(409, 'arr', arr, 4);
                            J$.N(417, 'sum', sum, 0);
                            J$.N(425, 'i', i, 0);
                            var sum = J$.X1(233, J$.W(225, 'sum', J$.T(217, 0, 22, false), sum, 1));
                            for (var i = J$.X1(257, J$.W(249, 'i', J$.T(241, 0, 22, false), i, 1)); J$.X1(1297, J$.C(40, J$.B(42, '<', J$.R(265, 'i', i, 0), J$.G(281, J$.R(273, 'arr', arr, 0), 'length', 0), 0))); J$.X1(1305, J$.B(66, '-', i = J$.W(305, 'i', J$.B(58, '+', J$.U(50, '+', J$.R(297, 'i', i, 0)), J$.T(289, 1, 22, false), 0), i, 0), J$.T(313, 1, 22, false), 0))) {
                                J$.X1(361, sum = J$.W(353, 'sum', J$.B(74, '+', J$.R(345, 'sum', sum, 0), J$.G(337, J$.R(321, 'arr', arr, 0), J$.R(329, 'i', i, 0), 4), 0), sum, 0));
                            }
                            return J$.X1(385, J$.Rt(377, J$.R(369, 'sum', sum, 0)));
                        } catch (J$e) {
                            J$.Ex(1313, J$e);
                        } finally {
                            if (J$.Fr(1321))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }
            function divideNumbers(a, b) {
                jalangiLabel2:
                    while (true) {
                        try {
                            J$.Fe(521, arguments.callee, this, arguments);
                            arguments = J$.N(529, 'arguments', arguments, 4);
                            a = J$.N(537, 'a', a, 4);
                            b = J$.N(545, 'b', b, 4);
                            if (J$.X1(1329, J$.C(48, J$.B(82, '===', J$.R(433, 'b', b, 0), J$.T(441, 0, 22, false), 0)))) {
                                throw J$.X1(481, J$.Th(473, J$.F(465, J$.R(449, 'Error', Error, 2), 1)(J$.T(457, 'Division by zero', 21, false))));
                            }
                            return J$.X1(513, J$.Rt(505, J$.B(90, '/', J$.R(489, 'a', a, 0), J$.R(497, 'b', b, 0), 0)));
                        } catch (J$e) {
                            J$.Ex(1337, J$e);
                        } finally {
                            if (J$.Fr(1345))
                                continue jalangiLabel2;
                            else
                                return J$.Ra();
                        }
                    }
            }
            validateUser = J$.N(1217, 'validateUser', J$.T(1209, validateUser, 12, false, 185), 0);
            calculateSum = J$.N(1233, 'calculateSum', J$.T(1225, calculateSum, 12, false, 393), 0);
            divideNumbers = J$.N(1249, 'divideNumbers', J$.T(1241, divideNumbers, 12, false, 521), 0);
            J$.N(1257, 'user', user, 0);
            J$.X1(577, J$.M(569, J$.R(553, 'console', console, 2), 'log', 0)(J$.T(561, 'Testing validateUser...', 21, false)));
            J$.X1(633, J$.M(625, J$.R(585, 'console', console, 2), 'log', 0)(J$.F(617, J$.R(593, 'validateUser', validateUser, 1), 0)(J$.T(601, 'admin', 21, false), J$.T(609, 'password123', 21, false))));
            J$.X1(689, J$.M(681, J$.R(641, 'console', console, 2), 'log', 0)(J$.F(673, J$.R(649, 'validateUser', validateUser, 1), 0)(J$.T(657, 'ab', 21, false), J$.T(665, 'short', 21, false))));
            J$.X1(721, J$.M(713, J$.R(697, 'console', console, 2), 'log', 0)(J$.T(705, '\nTesting calculateSum...', 21, false)));
            J$.X1(809, J$.M(801, J$.R(729, 'console', console, 2), 'log', 0)(J$.F(793, J$.R(737, 'calculateSum', calculateSum, 1), 0)(J$.T(785, [
                J$.T(745, 1, 22, false),
                J$.T(753, 2, 22, false),
                J$.T(761, 3, 22, false),
                J$.T(769, 4, 22, false),
                J$.T(777, 5, 22, false)
            ], 10, false))));
            J$.X1(881, J$.M(873, J$.R(817, 'console', console, 2), 'log', 0)(J$.F(865, J$.R(825, 'calculateSum', calculateSum, 1), 0)(J$.T(857, [
                J$.T(833, 10, 22, false),
                J$.T(841, 20, 22, false),
                J$.T(849, 30, 22, false)
            ], 10, false))));
            J$.X1(913, J$.M(905, J$.R(889, 'console', console, 2), 'log', 0)(J$.T(897, '\nTesting divideNumbers...', 21, false)));
            try {
                J$.X1(969, J$.M(961, J$.R(921, 'console', console, 2), 'log', 0)(J$.F(953, J$.R(929, 'divideNumbers', divideNumbers, 1), 0)(J$.T(937, 10, 22, false), J$.T(945, 2, 22, false))));
                J$.X1(1025, J$.M(1017, J$.R(977, 'console', console, 2), 'log', 0)(J$.F(1009, J$.R(985, 'divideNumbers', divideNumbers, 1), 0)(J$.T(993, 10, 22, false), J$.T(1001, 0, 22, false))));
            } catch (e) {
                e = J$.N(1081, 'e', e, 1);
                J$.X1(1073, J$.M(1065, J$.R(1033, 'console', console, 2), 'log', 0)(J$.T(1041, 'Caught exception:', 21, false), J$.G(1057, J$.R(1049, 'e', e, 0), 'message', 0)));
            }
            var user = J$.X1(1129, J$.W(1121, 'user', J$.T(1113, {
                name: J$.T(1089, 'John', 21, false),
                age: J$.T(1097, 30, 22, false),
                email: J$.T(1105, 'john@example.com', 21, false)
            }, 11, false), user, 3));
            J$.X1(1193, J$.M(1185, J$.R(1137, 'console', console, 2), 'log', 0)(J$.T(1145, '\nUser object:', 21, false), J$.G(1161, J$.R(1153, 'user', user, 1), 'name', 0), J$.G(1177, J$.R(1169, 'user', user, 1), 'age', 0)));
        } catch (J$e) {
            J$.Ex(1353, J$e);
        } finally {
            if (J$.Sr(1361)) {
                J$.L();
                continue jalangiLabel3;
            } else {
                J$.L();
                break jalangiLabel3;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
