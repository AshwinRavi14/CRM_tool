const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function runAdvancedSecurityTests() {
    console.log('--- Starting Advanced Security & Hierarchical RBAC Tests ---');

    try {
        // 1. Setup Hierarchy: Manager -> Rep A, Manager B -> Rep B
        console.log('1. Setting up manager/rep hierarchy...');

        // Register Manager
        const managerRes = await axios.post(`${API_URL}/auth/register`, {
            firstName: 'Manager', lastName: 'A', role: 'SALES_MANAGER',
            email: `manager_a_${Date.now()}@test.com`, password: 'password123'
        });
        const managerToken = managerRes.data.data.accessToken;
        const managerId = managerRes.data.data.user.id;

        // Register Rep A (Reporting to Manager A)
        const repARes = await axios.post(`${API_URL}/auth/register`, {
            firstName: 'Rep', lastName: 'A', role: 'SALES_REP',
            email: `rep_a_${Date.now()}@test.com`, password: 'password123',
            manager: managerId
        });
        const repAToken = repARes.data.data.accessToken;
        const repAId = repARes.data.data.user.id;

        // Register Manager B
        const managerBRes = await axios.post(`${API_URL}/auth/register`, {
            firstName: 'Manager', lastName: 'B', role: 'SALES_MANAGER',
            email: `manager_b_${Date.now()}@test.com`, password: 'password123'
        });
        const managerBToken = managerBRes.data.data.accessToken;

        // Register Rep B (Reporting to Manager B)
        const repBRes = await axios.post(`${API_URL}/auth/register`, {
            firstName: 'Rep', lastName: 'B', role: 'SALES_REP',
            email: `rep_b_${Date.now()}@test.com`, password: 'password123',
            manager: managerBRes.data.data.user._id
        });
        const repBToken = repBRes.data.data.accessToken;

        console.log('✅ Hierarchy created: Manager A -> Rep A, Manager B -> Rep B');

        // 2. Rep A creates an account
        console.log('\n2. Rep A creates an account...');
        const accRes = await axios.post(`${API_URL}/accounts`, {
            companyName: 'Rep A Project', accountType: 'PROSPECT'
        }, { headers: { Authorization: `Bearer ${repAToken}` } });
        const accId = accRes.data.data._id;
        console.log('✅ Account created by Rep A');

        // 3. Test Hierarchical Access (Success case: Manager A sees Rep A data)
        console.log('\n3. Testing Manager Access: Can Manager A see Rep A\'s account?');
        try {
            await axios.get(`${API_URL}/accounts/${accId}`, {
                headers: { Authorization: `Bearer ${managerToken}` }
            });
            console.log('✅ SUCCESS: Manager A accessed Rep A\'s account (Hierarchy working)');
        } catch (err) {
            console.log('❌ FAIL: Manager A was denied access to direct report\'s account');
        }

        // 4. Test Cross-Team Access (Failure case: Manager B cannot see Rep A data)
        console.log('\n4. Testing Cross-Team Boundary: Can Manager B see Rep A\'s account?');
        try {
            await axios.get(`${API_URL}/accounts/${accId}`, {
                headers: { Authorization: `Bearer ${managerBToken}` }
            });
            console.log('❌ FAIL: Manager B successfully accessed Rep A\'s account (Privacy breach)');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ SUCCESS: Manager B blocked from Rep A\'s account (Data boundaries preserved)');
            } else {
                console.log('❓ Unexpected status:', err.response ? err.response.status : err.message);
            }
        }

        // 5. Advanced XSS Test (Using sanitize-html)
        console.log('\n5. Testing Advanced XSS: Sending "onmouseover" and "javascript:" payloads');
        const xssPayload = {
            companyName: 'Hacker <b onmouseover=alert(1)>Bold</b>',
            accountType: 'PROSPECT',
            description: '<a href="javascript:alert(1)">Click me</a>'
        };
        const xssRes = await axios.post(`${API_URL}/accounts`, xssPayload, {
            headers: { Authorization: `Bearer ${repAToken}` }
        });
        const savedAcc = xssRes.data.data;
        console.log('Resulting Company Name:', savedAcc.companyName);
        console.log('Resulting Description:', savedAcc.description);

        if (savedAcc.companyName.includes('onmouseover') || savedAcc.description.includes('javascript:')) {
            console.log('❌ XSS FAIL: Advanced tags/attributes were NOT stripped');
        } else {
            console.log('✅ XSS SUCCESS: Advanced malicious attributes stripped');
        }

        // 6. Rate Limiting Test
        console.log('\n6. Testing Rate Limiting (Burst of 110 requests)...');
        let blocked = false;
        const requests = [];
        for (let i = 0; i < 110; i++) {
            requests.push(axios.get(`${API_URL}/accounts`, {
                headers: { Authorization: `Bearer ${repAToken}` }
            }).catch(err => err));
        }
        const results = await Promise.all(requests);
        const rateLimitHits = results.filter(r => r.response && r.response.status === 429);
        if (rateLimitHits.length > 0) {
            console.log(`✅ RATE LIMIT SUCCESS: Blocked ${rateLimitHits.length} requests with 429`);
        } else {
            console.log('❌ RATE LIMIT FAIL: 110 requests were allowed without 429');
        }

        console.log('\n--- Advanced Security Tests Completed ---');

    } catch (err) {
        console.error('❌ CRITICAL ERROR IN TEST SETUP:', err.message);
        if (err.response) console.error(JSON.stringify(err.response.data, null, 2));
    }
}

runAdvancedSecurityTests();
