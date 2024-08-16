#!/usr/bin/env bash
# run_client.sh

echo "Start of run_client.sh"

# check http endpoint
curl http://localhost:3000
echo "" # add a return character for better looking log
curl http://localhost:3000/abc
echo ""

# check static-server
curl http://localhost:3000/aaa.txt

# chech socket.io (websocket)
node dist/tester_websocket_client.js

echo "End of run_client.sh"
