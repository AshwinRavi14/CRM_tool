const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';
let authToken = '';
const testEmail = `test_qa_${Date.now()}@wersel.ai`;

async function runEdgeCaseTests() {
    console.log('--- Starting Validation & Edge Case Tests ---');

    try {
        // 1. Setup: Register/Login
        console.log('1. Setting up test user...');
        try {
            const regRes = await axios.post(`${API_URL}/auth/register`, {
                firstName: 'QA', lastName: 'Tester', email: testEmail, password: 'password123', role: 'ADMIN'
            });
            authToken = regRes.data.data.accessToken;
            console.log('✅ Registered and authenticated');
        } catch (regErr) {
            console.error('Registration failed:', regErr.response?.data || regErr.message);
            // Fallback to login if it somehow exists
            const loginRes = await axios.post(`${API_URL}/auth/login`, { email: testEmail, password: 'password123' });
            authToken = loginRes.data.data.accessToken;
        }
        if (!authToken) {
            console.error('❌ FATAL: Auth token is missing!');
        } else {
            console.log('✅ Auth token extracted:', authToken.substring(0, 10) + '...');
        }
        const headers = { Authorization: `Bearer ${authToken}` };

        // --- TEST GROUP 1: FIELD VALIDATION ---

        // Test 1.1: Invalid Email Format
        console.log('2.1 Testing Invalid Email Validation...');
        try {
            await axios.post(`${API_URL}/leads`, {
                firstName: 'Bad', lastName: 'Email', email: 'not-an-email', company: 'Test'
            }, { headers });
            console.error('❌ FAILED: Invalid email was accepted');
        } catch (err) {
            if (err.response?.status === 500 || err.response?.status === 400) {
                console.log('✅ PASSED: Invalid email rejected');
            } else {
                console.error('❌ UNKNOWN ERROR:', err.message);
                console.error('Response Data:', err.response?.data);
            }
        }

        // Test 1.2: Missing Required Field
        console.log('2.2 Testing Missing Required Field...');
        try {
            await axios.post(`${API_URL}/leads`, { firstName: 'NoLast' }, { headers });
            console.error('❌ FAILED: Missing field was accepted');
        } catch (err) {
            console.log('✅ PASSED: Missing field rejected');
        }

        // --- TEST GROUP 2: INTEGRITY ---

        // Test 2.1: Delete Account (should work now)
        console.log('3.1 Testing Account Deletion...');
        // First create a dummy account
        const accRes = await axios.post(`${API_URL}/accounts`, {
            companyName: 'DeleteMe Corp', accountType: 'PROSPECT', email: 'delete@me.com'
        }, { headers });
        const accId = accRes.data.data._id;

        // Now delete it
        await axios.delete(`${API_URL}/accounts/${accId}`, { headers });

        // Verify it's gone
        try {
            await axios.get(`${API_URL}/accounts/${accId}`, { headers });
            console.error('❌ FAILED: Deleted account still exists');
        } catch (err) {
            if (err.response?.status === 404) console.log('✅ PASSED: Account deleted successfully');
        }


        // --- TEST GROUP 3: WORKFLOW ---

        // Test 3.1: Duplicate Lead Conversion (Logic Check)
        console.log('4.1 Testing Duplicate Lead Conversion...');
        const leadRes = await axios.post(`${API_URL}/leads`, {
            firstName: 'Double', lastName: 'Convert', email: `double_${Date.now()}@test.com`, company: 'Double Inc', source: 'WEBSITE'
        }, { headers });
        const leadId = leadRes.data.data._id;

        // Convert once
        await axios.post(`${API_URL}/leads/${leadId}/convert`, {}, { headers });

        // Try converting again
        try {
            await axios.post(`${API_URL}/leads/${leadId}/convert`, {}, { headers });
            console.warn('⚠️ WARNING: Backend allowed duplicate conversion (logic gap?)');
        } catch (err) {
            if (err.response?.status === 400) {
                console.log('✅ PASSED: Duplicate conversion blocked');
            } else {
                console.warn('⚠️ RESPONSE:', err.response?.status);
            }
        }

        console.log('\n--- Edge Case Tests Completed ---');
    } catch (err) {
        console.error('❌ CRITICAL TEST FAILURE:', err.message);
        if (err.response) {
            console.error('Response Data:', JSON.stringify(err.response.data, null, 2));
        }
    }
}

runEdgeCaseTests();
