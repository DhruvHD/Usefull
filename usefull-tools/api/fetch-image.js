export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url, username, password } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        };

        if (username || password) {
            const token = Buffer.from(`${username || ''}:${password || ''}`).toString('base64');
            headers['Authorization'] = `Basic ${token}`;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 25000);

        const response = await fetch(url, {
            headers,
            redirect: 'follow',
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            return res.status(response.status).json({ error: `HTTP ${response.status}` });
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).send(buffer);

    } catch (error) {
        return res.status(500).json({ error: error.message || 'Failed to fetch image' });
    }
}
