// @ts-nocheck
import express from 'express';
import { createSession, createChannel } from 'better-sse';
import {
    registerContainerAdded,
    registerContainerUpdated,
    registerContainerRemoved,
} from '../event';

const channel = createChannel();

registerContainerAdded((container) => {
    channel.broadcast(container, 'container-added');
});

registerContainerUpdated((container) => {
    channel.broadcast(container, 'container-updated');
});

registerContainerRemoved((container) => {
    channel.broadcast(container, 'container-removed');
});

/**
 * Init Router.
 * @returns {*}
 */
export function init() {
    const router = express.Router();

    router.get('/', async (req, res) => {
        res.setHeader('X-Accel-Buffering', 'no');
        const session = await createSession(req, res);
        channel.register(session);
    });

    return router;
}
