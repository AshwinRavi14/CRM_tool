const axios = require('axios');

async function registerAdmin() {
    try {
        const adminEmail = 'admin@wersel.ai';
        console.log(`Attempting to register ${adminEmail} via API...`);

        try {
            const response = await axios.post('http://localhost:3000/api/v1/auth/register', {
                firstName: 'Admin',
                lastName: 'User',
                email: adminEmail,
                password: 'password123',
                role: 'ADMIN'
            });
            console.log('✅ Admin user registered successfully via API.');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message === 'User already exists') {
                console.log('ℹ️ Admin user already exists in the system.');
            } else {
                throw err;
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error registering admin:', err.response ? err.response.data : err.message);
        process.exit(1);
    }
}

registerAdmin();
