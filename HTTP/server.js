import http from 'http';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = http.createServer(async (req, res) => {
    console.log(`Received ${req.method} request for ${req.url}`);

    if (req.method === 'GET' && req.url === '/') {
        try {
            console.log('Attempting to read form.html');
            const content = await fs.readFile(join(__dirname, 'form.html'), 'utf-8');
            console.log('Successfully read form.html');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        } catch (err) {
            console.error('Error reading form.html:', err);
            res.writeHead(500);
            res.end('Error loading form.html');
        }
    } else if (req.method === 'POST' && req.url === '/') {
        let body = '';
        for await (const chunk of req) {
            body += chunk.toString();
        }
        try {
            console.log('POST:', body);
            const userData = JSON.parse(body);
            const dataToWrite = JSON.stringify(userData) + '\n';
            await fs.appendFile('users.json', dataToWrite);
            res.writeHead(201, { 'Content-Type': 'text/plain' });
            res.end('Created');
        } catch (error) {
            console.error('Error processing POST request:', error);
            res.writeHead(400);
            res.end('Invalid JSON');
        }
    } else {
        console.log('Route not found');
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});