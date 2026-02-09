const axios = require('axios');
const API_URL = 'http://localhost:3000/api/v1';

async function verifyRoles() {
    console.log('--- Verifying Signup Roles ---');
    const roles = ['FOUNDER', 'OTHER'];

    for (const role of roles) {
        console.log(`Testing signup with role: ${role}...`);
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                name: `Test ${role}`,
                email: `test_${role.toLowerCase()}_${Date.now()}@example.com`,
                password: 'password123',
                companyName: 'Test Org',
                role: role
            });
            console.log(`✅ ${role} registration successful:`, response.data.message);
        } catch (err) {
            console.error(`❌ ${role} registration failed:`, err.response ? err.response.data : err.message);
            process.exit(1);
        }
    }
}

verifyRoles();
