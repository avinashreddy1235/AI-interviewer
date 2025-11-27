import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function testBackend() {
    try {
        console.log('Testing Backend API...');

        // 1. Save Interview
        console.log('1. Saving Interview...');
        const interviewData = {
            date: new Date().toISOString(),
            topic: 'Test Interview',
            score: 85,
            feedback: { summary: 'Good job', overallScore: 85 },
            transcript: [{ role: 'user', text: 'Hello' }, { role: 'ai', text: 'Hi' }]
        };
        const saveRes = await axios.post(`${API_URL}/interviews`, interviewData);
        console.log('   Saved! ID:', saveRes.data.id);
        const id = saveRes.data.id;

        // 2. Get Interviews
        console.log('2. Fetching Interviews...');
        const listRes = await axios.get(`${API_URL}/interviews`);
        console.log('   Fetched', listRes.data.length, 'interviews');
        const saved = listRes.data.find(i => i.id === id);
        if (!saved) throw new Error('Saved interview not found in list');
        console.log('   Found saved interview in list.');

        // 3. Get Interview Details
        console.log('3. Fetching Details...');
        const detailRes = await axios.get(`${API_URL}/interviews/${id}`);
        if (detailRes.data.topic !== 'Test Interview') throw new Error('Topic mismatch');
        console.log('   Details verified.');

        console.log('✅ Backend Verification Successful!');
    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
        process.exit(1);
    }
}

testBackend();
