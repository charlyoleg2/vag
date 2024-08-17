#!/usr/bin/env node
// vagg_server.ts

import { Hono } from 'hono';
import { serve as honoServer } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Server as WSserver } from 'socket.io';
import type { Server as HTTPServer } from 'node:http';

console.log('hello from vagg_server.ts!');

const app = new Hono();
const port = 3000;

const httpServer = honoServer({
	fetch: app.fetch,
	port: 3000
});

// http endpoints
app.get('/api/abc', (ctx) => {
	return ctx.text('Hello from /api/abc');
});

// static-server middleware
app.use(
	'*',
	serveStatic({
		root: './dist/public', // TODO: change it to absolute path
		onNotFound: (path, ctx) => {
			console.log(`dbg028: ${path} is not found, request to ${ctx.req.path}`);
		}
	})
);

// websocket
const io = new WSserver(httpServer as HTTPServer, {});

io.on('connection', (socket) => {
	socket.emit('hello', 'worldy');

	socket.on('howdy', (arg) => {
		console.log(`server receives: ${arg}`);
	});
});

console.log(`vagg_server is running on port ${port}`);
