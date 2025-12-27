#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = "."  # Current directory, or specify a path like "./my-website"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    # Change to the specified directory
    os.chdir(DIRECTORY)
    
    # Create server
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"Server running at {url}")
        print("Press Ctrl+C to stop the server")
        
        # Open browser
        webbrowser.open(url)
        
        # Start serving
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()