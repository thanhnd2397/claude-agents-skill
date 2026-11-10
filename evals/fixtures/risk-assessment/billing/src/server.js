'use strict';

const http = require('node:http');
const { voidInvoice } = require('./invoices');
const { purge } = require('./admin');
const credentials = require('node:fs').readFileSync(__dirname + '/../config/credentials.yml', 'utf8');

const server = http.createServer(async (req, res) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  const payload = body ? JSON.parse(body) : {};

  if (req.method === 'POST' && req.url === '/invoices/void') {
    const result = await voidInvoice(payload);
    res.writeHead(result.status);
    res.end(JSON.stringify(result));
    return;
  }
  if (req.method === 'POST' && req.url === '/admin/purge') {
    await purge(payload.table);
    res.writeHead(204);
    res.end();
    return;
  }
  res.writeHead(404);
  res.end();
});

server.listen(process.env.PORT || 3000);
