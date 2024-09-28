#!/usr/bin/env node
// vagg_server.ts

import { Hono } from 'hono';
import { serve as honoServer } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Server as WSserver } from 'socket.io';
import type { Server as HTTPServer } from 'node:http';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'node:path';

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
app.get('/api/currDir', (ctx) => {
	const rCurrDir = process.cwd();
	return ctx.text(rCurrDir);
});

// static-server middleware
//const publicAbsPath = path.resolve(import.meta.dirname, './public');
const publicAbsPath = path.resolve('./dist/public'); // TODO : use Absolute path
//console.log(`dbg343: publicAbsPath: ${publicAbsPath}`);
app.use(
	'*',
	serveStatic({
		root: publicAbsPath,
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

await sleep(100); // wait 100 ms for fun
console.log(`vagg_server is running on port ${port}`);
