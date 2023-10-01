import express from 'express';

import { migrate } from './db';
import v1 from './api/v1';

const bootstrap = async () => {
    await migrate();

    express()
        .use(express.json())
        .use('/v1', v1)
        .listen(process.env.LISTEN, () =>
            console.log(`running on http://localhost:${process.env.LISTEN}/`),
        );
};

bootstrap();
