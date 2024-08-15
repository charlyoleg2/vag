#!/usr/bin/env node
// tester_websocket_client.ts

import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

socket.on('hello', (arg) => {
	console.log(`tester-client receives: ${arg}`);
});

//socket.emit("howdy", "blibla");
