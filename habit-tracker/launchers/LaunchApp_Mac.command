#!/bin/bash
# Move into the folder where this script is saved
cd "$(dirname -- "${BASH_SOURCE[0]}")/.."

# Start Python's built-in simple server in the background (built-in to macOS)
python3 -m http.server 8080 > /dev/null 2>&1 &

# Save the process ID to close it later if needed
SERVER_PID=$!

# Wait 1 second and open the default browser
sleep 1
open http://localhost:8080/index.html

# Keep script alive just to let them close it cleanly
echo "App is running! You can close this window now."
