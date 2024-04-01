import axios from 'axios';

const API_BASE_URL =
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
        ? 'http://localhost:8000'
        : 'https://grit-ai-server.eba-fnrbnpmh.us-east-1.elasticbeanstalk.com';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

export default apiClient;