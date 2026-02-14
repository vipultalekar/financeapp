
import { handle } from 'hono/vercel';
import { app } from '../src/index';

export const config = {
    runtime: 'edge', // or 'nodejs' if needed, but edge is usually preferred for Hono unless you use Node APIs like filesystem
};

export default handle(app);
