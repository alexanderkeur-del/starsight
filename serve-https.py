#!/usr/bin/env python3
"""Simple HTTPS server for local development."""
import http.server
import ssl
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

server = http.server.HTTPServer(('0.0.0.0', 8443), http.server.SimpleHTTPRequestHandler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain('cert.pem', 'key.pem')
server.socket = ctx.wrap_socket(server.socket, server_side=True)

print('HTTPS server running at https://192.168.178.124:8443/')
server.serve_forever()
