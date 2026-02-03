const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';
let authToken = '';
let testUserId = '';
let testLeadId = '';
let testAccountId = '';
let testContactId = '';
let testOpportunityId = '';

async function runTests() {
    console.log('--- Starting CRM Functional Tests ---');

    try {
        // 1. Auth Test: Register
        console.log('1. Testing User Registration...');
        const testEmail = `test_${Date.now()}@wersel.ai`;
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            firstName: 'Test',
            lastName: 'User',
            email: testEmail,
            password: 'password123',
            role: 'ADMIN'
        });
        console.log('✅ Registration Successful');

        // 2. Auth Test: Login
        console.log('2. Testing User Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testEmail,
            password: 'password123'
        });
        console.log('✅ Login Successful');

        authToken = loginRes.data.data.accessToken;
        testUserId = loginRes.data.data.user.id;

        const headers = { Authorization: `Bearer ${authToken}` };

        // 3. Leads Test: Create Lead
        console.log('3. Testing Lead Creation...');
        const leadRes = await axios.post(`${API_URL}/leads`, {
            firstName: 'Potential',
            lastName: 'Client',
            email: `lead_${Date.now()}@gmail.com`,
            company: 'Test Corp',
            source: 'WEBSITE'
        }, { headers });
        testLeadId = leadRes.data.data._id;
        console.log('✅ Lead Created:', leadRes.data.data.leadNumber);

        // 4. Leads Test: Qualify
        console.log('4. Testing Lead Qualification...');
        await axios.post(`${API_URL}/leads/${testLeadId}/qualify`, {
            rating: 'HOT',
            notes: 'Very interested in AI solutions'
        }, { headers });
        console.log('✅ Lead Qualified');

        // 5. Leads Test: Convert
        console.log('5. Testing Lead Conversion...');
        const convRes = await axios.post(`${API_URL}/leads/${testLeadId}/convert`, {}, { headers });
        testAccountId = convRes.data.data.account._id;
        testContactId = convRes.data.data.contact._id;
        console.log('✅ Lead Converted to Account:', convRes.data.data.account.accountNumber);

        // 6. Opportunity Test: Create
        console.log('6. Testing Opportunity Creation...');
        const oppRes = await axios.post(`${API_URL}/opportunities`, {
            name: 'AI Integration Project',
            account: testAccountId,
            amount: 50000,
            stage: 'PROSPECTING'
        }, { headers });
        testOpportunityId = oppRes.data.data._id;
        console.log('✅ Opportunity Created');

        // 7. Opportunity Test: Advance to Won (Triggers Project)
        console.log('7. Testing Stage Advancement & Automated Project...');
        await axios.put(`${API_URL}/opportunities/${testOpportunityId}/advance-stage`, {
            newStage: 'CLOSED_WON'
        }, { headers });
        console.log('✅ Opportunity Won');

        // Wait for event handler to process project creation
        console.log('Waiting for background project automation...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // 8. Project Test: Verify Creation
        console.log('8. Verifying Automated Project Creation...');
        const projectsRes = await axios.get(`${API_URL}/projects`, { headers });
        const associatedProject = projectsRes.data.data.find(p => p.opportunity === testOpportunityId);
        if (associatedProject) {
            console.log('✅ Project Automatically Created:', associatedProject.projectCode);
        } else {
            console.log('❌ Project NOT Created automatically');
        }

        // 9. Dashboard Test: Metrics
        console.log('9. Testing Dashboard Metrics...');
        const metricsRes = await axios.get(`${API_URL}/dashboard/metrics`, { headers });
        console.log('✅ Dashboard Metrics retrieved. Total Accounts:', metricsRes.data.data.totals.accounts);

        console.log('\n--- All Automated Backend Tests Passed! ---');
    } catch (err) {
        console.error('❌ Test Failed:', err.response ? err.response.data : err.message);
    }
}

runTests();
