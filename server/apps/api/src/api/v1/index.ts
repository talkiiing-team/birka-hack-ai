import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import { eq } from 'drizzle-orm';

import { db } from '../../db';
import { predictRequests } from '../../schemas/predictRequests';
import * as openapi from './openapi.json';

const upload = multer();

export default Router()
    .use('/docs', swaggerUi.serve, swaggerUi.setup(openapi))
    .post('/predicts', upload.single('train'), async (req, res) => {
        if (!req.file) {
            return res.status(400).send('missed train file');
        }

        const [created] = await db.insert(predictRequests).values({}).returning();

        console.log(`created predict request: ${JSON.stringify(created)}`);

        const formData = new FormData();
        formData.append('train', req.file.buffer, {
            filename: 'train.csv',
            contentType: 'text/csv',
        });

        axios
            .post(`${process.env.ML_URL}/predict`, formData, { timeout: 120_000 })
            .then(result =>
                db
                    .update(predictRequests)
                    .set({ result: result.data, status: 'done' })
                    .where(eq(predictRequests.id, created.id))
                    .returning(),
            )
            .then(([{ result, ...request }]) =>
                console.log(`resolved predict request: ${JSON.stringify(request)}`),
            )
            .catch(async () => {
                await db
                    .update(predictRequests)
                    .set({ status: 'failed' })
                    .where(eq(predictRequests.id, created.id));

                console.log(`failed predict request ${created.id}`);
            });

        return res.status(201).json(created);
    })
    .get('/predicts/:id', async (req, res) => {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).send('bad predict request id');
        }

        const [found] = await db.select().from(predictRequests).where(eq(predictRequests.id, id));

        if (!found) {
            res.send(404);
        }

        return res.status(200).json(found);
    })
    .get('/predicts', async (req, res) => {
        const found = await db
            .select({
                id: predictRequests.id,
                status: predictRequests.status,
                ts: predictRequests.ts,
            })
            .from(predictRequests);

        return res.status(200).json(found);
    });
