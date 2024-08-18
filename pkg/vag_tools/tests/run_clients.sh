#!/usr/bin/env bash
# run_client.sh

echo "Start of run_client.sh"

# check http endpoint
curl http://localhost:3000/api/abc
echo "" # add a return character for better looking log
#curl http://localhost:3000
#echo ""
curl http://localhost:3000/api/currDir
echo ""

# check static-server
echo "http-GET http://localhost:3000"
curl --head http://localhost:3000
echo "http-GET http://localhost:3000/_app/version.json"
curl http://localhost:3000/_app/version.json
echo ""

# chech socket.io (websocket)
node dist/tester_websocket_client.js

echo "End of run_client.sh"
