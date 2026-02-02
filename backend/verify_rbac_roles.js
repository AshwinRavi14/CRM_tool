const axios = require('axios');
const API_URL = 'http://localhost:3000/api/v1';

async function testRBAC() {
    console.log('--- Testing RBAC Roles ---');
    try {
        // 1. Setup users
        const salesRep = {
            firstName: 'Sales',
            lastName: 'Rep',
            email: `rep_${Date.now()}@test.com`,
            password: 'password123',
            role: 'SALES_REP'
        };
        const admin = {
            firstName: 'Admin',
            lastName: 'User',
            email: `admin_${Date.now()}@test.com`,
            password: 'password123',
            role: 'ADMIN'
        };

        const resRep = await axios.post(`${API_URL}/auth/register`, salesRep);
        const tokenRep = resRep.data.data.accessToken;

        const resAdmin = await axios.post(`${API_URL}/auth/register`, admin);
        const tokenAdmin = resAdmin.data.data.accessToken;

        // 2. Sales Rep creates an account
        const accRes = await axios.post(`${API_URL}/accounts`, {
            companyName: 'Delete Me',
            accountType: 'PROSPECT'
        }, { headers: { Authorization: `Bearer ${tokenRep}` } });
        const accId = accRes.data.data._id;

        // 3. Sales Rep tries to delete (Should be forbidden by RBAC)
        console.log('Testing deletion by SALES_REP (Should fail)...');
        try {
            await axios.delete(`${API_URL}/accounts/${accId}`, {
                headers: { Authorization: `Bearer ${tokenRep}` }
            });
            console.log('❌ RBAC FAIL: Sales Rep was allowed to delete an account!');
        } catch (err) {
            if (err.response && err.response.status === 403) {
                console.log('✅ RBAC PASSED: Sales Rep blocked from deletion.');
            } else {
                console.log('❓ Unexpected status:', err.response.status);
            }
        }

        // 4. Admin deletes it (Should work)
        console.log('Testing deletion by ADMIN (Should work)...');
        try {
            await axios.delete(`${API_URL}/accounts/${accId}`, {
                headers: { Authorization: `Bearer ${tokenAdmin}` }
            });
            console.log('✅ RBAC PASSED: Admin successfully deleted the account.');
        } catch (err) {
            console.log('❌ RBAC FAIL: Admin could not delete account!', err.message);
        }

    } catch (err) {
        console.error('❌ Test Setup Error:', err.response ? err.response.data : err.message);
    }
}

testRBAC();
