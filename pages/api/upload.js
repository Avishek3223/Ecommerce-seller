import multiparty from 'multiparty';

export default async function handle(req, res) {
    const form = new multiparty.Form(); 
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('Error parsing form:', err);
            res.status(500).json({ error: 'Failed to parse form' });
            return;
        }

        res.json('ok');
    });
}

export const config = {
    api: { bodyParser: false }
};
