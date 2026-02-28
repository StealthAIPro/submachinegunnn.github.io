import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bare = createBareServer('/bare/');
const app = express();
const server = createServer();

// 1. Serve static files from root (a.html, p.html, uv.sw.js, etc.)
app.use(express.static(__dirname));

// 2. Serve internal UV scripts
app.use('/uv/', express.static(uvPath));

// 3. Shortened Stealth Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));
app.get('/a', (req, res) => res.sendFile(path.join(__dirname, 'a.html')));
app.get('/p', (req, res) => res.sendFile(path.join(__dirname, 'p.html')));
app.get('/m', (req, res) => res.sendFile(path.join(__dirname, 'm.html')));
app.get('/s', (req, res) => res.sendFile(path.join(__dirname, 's.html')));

// 4. Handle Proxy Traffic (Bare Server)
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Stealth OS Active on Port ${PORT}`);
});
