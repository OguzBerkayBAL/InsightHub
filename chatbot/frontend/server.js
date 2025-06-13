const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const server = http.createServer((req, res) => {
    // Ana sayfa için index.html'i döndür
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end(`Hata: ${err.code}`);
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf8');
        });
    } else {
        res.writeHead(404);
        res.end('Sayfa bulunamadı');
    }
});

server.listen(PORT, () => {
    console.log(`Frontend sunucusu http://localhost:${PORT} adresinde çalışıyor`);
}); 