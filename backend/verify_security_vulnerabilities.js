const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function runSecurityTests() {
    console.log('--- Starting security & Access Control Tests ---');

    try {
        // 0. Test Unauthenticated Access
        console.log('0. Testing unauthenticated access...');
        try {
            await axios.get(`${API_URL}/accounts`);
            console.log('❌ VULNERABILITY FOUND: Accessed /accounts without login!');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log('✅ PASSED: Access blocked for unauthenticated user');
            } else {
                console.log('❓ Unexpected status for unauthenticated user:', err.response ? err.response.status : err.message);
            }
        }

        // 1. Create two users: Sales A and Sales B
        console.log('\n1. Setting up test users...');
        const userA = {
            firstName: 'Sales',
            lastName: 'A',
            email: `sales_a_${Date.now()}@test.com`,
            password: 'password123',
            role: 'SALES_REP'
        };
        const userB = {
            firstName: 'Sales',
            lastName: 'B',
            email: `sales_b_${Date.now()}@test.com`,
            password: 'password123',
            role: 'SALES_REP'
        };

        const resA = await axios.post(`${API_URL}/auth/register`, userA);
        const tokenA = resA.data.data.accessToken;
        console.log('✅ Sales A registered');

        const resB = await axios.post(`${API_URL}/auth/register`, userB);
        const tokenB = resB.data.data.accessToken;
        console.log('✅ Sales B registered');

        // 2. Sales A creates an account
        console.log('\n2. Sales A creates a private account...');
        const accountResA = await axios.post(`${API_URL}/accounts`, {
            companyName: 'Private Corp of A',
            accountType: 'PROSPECT',
            email: 'contact@privatea.com'
        }, { headers: { Authorization: `Bearer ${tokenA}` } });

        const accountIdA = accountResA.data.data._id;
        console.log(`✅ Account created by A (ID: ${accountIdA})`);

        // 3. Test IDOR: Sales B tries to access A's account
        console.log('\n3. Testing IDOR: can Sales B access A\'s account?');
        try {
            const getResB = await axios.get(`${API_URL}/accounts/${accountIdA}`, {
                headers: { Authorization: `Bearer ${tokenB}` }
            });
            console.log('❌ VULNERABILITY FOUND: Sales B successfully accessed Sales A\'s account!');
            console.log('Data:', JSON.stringify(getResB.data.data.companyName));
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ PASSED: Access denied for Sales B (Correct behavior)');
            } else {
                console.log('❓ Unexpected behavior on unauthorized access:', err.response ? err.response.status : err.message);
            }
        }

        // 4. Test Horizontal Escalation: Sales B tries to modify A's account
        console.log('\n4. Testing Modification: can Sales B update A\'s account?');
        try {
            await axios.put(`${API_URL}/accounts/${accountIdA}`, {
                companyName: 'Hacked by B'
            }, { headers: { Authorization: `Bearer ${tokenB}` } });
            console.log('❌ VULNERABILITY FOUND: Sales B successfully modified Sales A\'s account!');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ PASSED: Update denied for Sales B (Correct behavior)');
            } else {
                console.log('❓ Unexpected behavior on unauthorized update:', err.response ? err.response.status : err.message);
            }
        }

        // 5. Test Deletion: can Sales B delete A's account?
        console.log('\n5. Testing Deletion: can Sales B delete A\'s account?');
        try {
            await axios.delete(`${API_URL}/accounts/${accountIdA}`, {
                headers: { Authorization: `Bearer ${tokenB}` }
            });
            console.log('❌ VULNERABILITY FOUND: Sales B successfully deleted Sales A\'s account!');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ PASSED: Deletion denied for Sales B (Correct behavior)');
            } else {
                console.log('❓ Unexpected behavior on unauthorized deletion:', err.response ? err.response.status : err.message);
            }
        }

        console.log('\n--- Security Tests Completed ---');
    } catch (err) {
        console.error('❌ Set-up Error:', err.message);
        if (err.response) {
            console.error('Response:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

runSecurityTests();
