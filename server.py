#!/usr/bin/env python3
"""
Servidor HTTP simples que força o encoding UTF-8 para arquivos HTML
"""
import http.server
import socketserver
from pathlib import Path

PORT = 8000

class UTF8HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Força UTF-8 para arquivos HTML
        if self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        super().end_headers()
    
    def guess_type(self, path):
        """Override para garantir charset UTF-8 em arquivos HTML"""
        mimetype = super().guess_type(path)
        if path.endswith('.html'):
            return 'text/html; charset=utf-8'
        return mimetype

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), UTF8HTTPRequestHandler) as httpd:
        print(f"✅ Servidor rodando em http://localhost:{PORT}")
        print(f"📂 Servindo arquivos de: {Path.cwd()}")
        print(f"🔤 Encoding UTF-8 forçado para arquivos HTML")
        print("\nPressione Ctrl+C para parar o servidor")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Servidor encerrado")
