const axios = require('axios');

const API_URL = 'http://localhost:3000/api/v1';

async function benchmark() {
    console.log('--- API Performance Benchmarking ---');
    try {
        // 1. Register/Login
        const email = `benchmark_${Date.now()}@test.com`;
        await axios.post(`${API_URL}/auth/register`, {
            firstName: 'Bench',
            lastName: 'Mark',
            email: email,
            password: 'password123',
            role: 'ADMIN'
        });
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: email,
            password: 'password123'
        });
        const token = loginRes.data.data.accessToken;
        const headers = { Authorization: `Bearer ${token}` };

        async function measure(label, url) {
            const start = Date.now();
            const res = await axios.get(url, { headers });
            const duration = Date.now() - start;
            console.log(`${label}: ${duration}ms (${res.data.data.length || (res.data.data.leads ? res.data.data.leads.length : 'N/A')} items)`);
            return duration;
        }

        // 2. Measure Lists
        await measure('Accounts List (300+ items)', `${API_URL}/accounts`);
        await measure('Leads List (500+ items)', `${API_URL}/leads?limit=1000`);
        await measure('Opportunities List (600+ items)', `${API_URL}/opportunities`);

        // 3. Measure Filtered/Search
        await measure('Filtered Leads (Status=NEW)', `${API_URL}/leads?status=NEW&limit=1000`);

        console.log('\n--- Benchmarking Completed ---');
    } catch (err) {
        console.error('Benchmark error:', err.response ? err.response.data : err.message);
    }
}

benchmark();
