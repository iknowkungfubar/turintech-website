import http from 'http';
import { execSync } from 'child_process';
import { appendFileSync } from 'fs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

http.createServer((req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS).end();
    return;
  }
  
  if (req.url === '/favicon.ico') { res.writeHead(204).end(); return; }
  
  if (req.method !== 'POST' || req.url !== '/lead') {
    res.writeHead(404).end('Not found');
    return;
  }
  
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const timestamp = new Date().toISOString();
      const logLine = `[${timestamp}] Name:${data.name} Email:${data.email} Message:${data.message}`;
      
      appendFileSync('/tmp/leads.log', logLine + '\n');
      console.log(logLine);
      
      // Send email
      try {
        const text = `New Contact Form Submission\n\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}\nSubmitted: ${timestamp}`;
        execSync(`echo "${text}" | mail -s "New Lead from turintechsolutions.com" josh@turintechsolutions.com`, { timeout: 15000 });
      } catch(e) {
        console.error('Email error:', e.message);
      }
      
      res.writeHead(200, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ success: true }));
    } catch(e) {
      console.error('Parse error:', e.message);
      res.writeHead(400, { 'Content-Type': 'application/json', ...CORS_HEADERS });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
  });
}).listen(3456, () => console.log('Lead server on :3456'));
