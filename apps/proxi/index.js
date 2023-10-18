const http = require('http');
const httpProxy = require('http-proxy');

// Define the target URL where requests will be redirected
const targetUrl = 'https://nbx-develop.test-nubox.com:40043/';

// Create a proxy server
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  changeOrigin: true,
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
  });

  proxy.on('proxyRes', function(msg, incoming, response) {
    response.writeHead(200, { 
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*' ,
        'Access-Control-Allow-Origin': '*'
    });
  });

// Create an HTTP server to listen for incoming requests
const server = http.createServer((req, res) => {
  // Handle the request by proxying it to the target URL
  proxy.web(req, res, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Proxy Error');
    }
  });
});

// Listen on a specific port and host
const port = 8081;
const host = 'localhost';

server.listen(port, host, () => {
  console.log(`Proxy server is running on http://${host}:${port}`);
});
