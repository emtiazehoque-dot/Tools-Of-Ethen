#!/bin/bash
cd "$(dirname "$0")"
# Launch python's built-in server on a free port
python3 -m http.server 8080 > /dev/null 2>&1 &
sleep 1
# Open the system's default browser automatically
xdg-open http://localhost:8080/index.html
