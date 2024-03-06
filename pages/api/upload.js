import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

const bucketName = 'ecommerce-with-nextjs';

export default async function handle(req, res) {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            res.status(500).json({ error: 'Failed to parse form' });
            return;
        }

        const client = new S3Client({        //To connect with s3 with specific region and credentials
            region: 'us-east-1',
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            }
        });

        const links = [];
        for (const file of files.file) {
            const ext = file.originalFilename.split('.').pop();  //to retrive the format like png, jpg ...
            const newFilename = Date.now() + '.' + ext;

            try {
                await client.send(new PutObjectCommand({         //upload an object to an S3 bucket
                    Bucket: bucketName,
                    Key: newFilename,
                    Body: fs.readFileSync(file.path),
                    ACL: 'public-read',
                    ContentType: mime.lookup(file.path),
                }));
            } catch (error) {
                console.error('Error uploading file:', error);
                res.status(500).json({ error: 'Failed to upload file to S3' });
                return;
            }

            const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
            links.push(link);
        }
        res.json({ links });
    });
}

export const config = {
    api: { bodyParser: false }
};