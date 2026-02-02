const axios = require('axios');
const API_URL = 'http://localhost:3000/api/v1';

async function testXSS() {
    console.log('--- Testing XSS Sanitization ---');
    try {
        // 1. Register/Login
        const user = {
            firstName: 'XSS',
            lastName: 'Tester',
            email: `xsstest_${Date.now()}@test.com`,
            password: 'password123'
        };
        const res = await axios.post(`${API_URL}/auth/register`, user);
        const token = res.data.data.accessToken;

        // 2. Try to create account with script tag
        console.log('Sending payload with <script> tags...');
        const xssPayload = {
            companyName: 'Safe Company <script>alert("hacked")</script>',
            accountType: 'PROSPECT',
            description: '<img src=x onerror=alert(1)> Scary description'
        };

        const createRes = await axios.post(`${API_URL}/accounts`, xssPayload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const account = createRes.data.data;
        console.log('Stored Company Name:', account.companyName);
        console.log('Stored Description:', account.description);

        if (account.companyName.includes('<script>') || account.description.includes('onerror')) {
            console.log('❌ XSS TEST FAILED: Tags were NOT stripped!');
        } else {
            console.log('✅ XSS TEST PASSED: HTML tags were successfully stripped by sanitizer.');
        }

    } catch (err) {
        console.error('❌ Test failed:', err.response ? err.response.data : err.message);
    }
}

testXSS();
