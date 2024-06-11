#!/usr/bin/env node

/**
 * * index.JS
 * A Lightning-Fast Dashboard for Bull Queue Management
 */
const express = require('express');
const Queue = require('bull');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const queueNames = process.env.BULL_QUEUES ? process.env.BULL_QUEUES.split(',') : ['messages'];
const queueCnxString = process.env.BULL_CONNECTION || 'redis://127.0.0.1:6379';
const uiBasePath = process.env.BULL_UI_BASE_PATH || '/admin/queues';
const bullPort = process.env.BULL_PORT || 3000;

const queues = queueNames.map(queueName => new Queue(queueName, queueCnxString));

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(uiBasePath);

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: queues.map(queue => new BullAdapter(queue)),
  serverAdapter: serverAdapter,
});

const app = express();

app.use(uiBasePath, serverAdapter.getRouter());

app.listen(bullPort, () => {
  console.log(`Bull Board available at http://localhost:${bullPort}${uiBasePath}`);
});
