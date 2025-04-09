// src/app/api/scan-receipt/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
    try {
        const body = await req.json();
        const { file_url } = body;

        if (!file_url) {
            return NextResponse.json({ error: 'Missing file_url' }, { status: 400 });
        }

        const VERYFI_CLIENT_ID = process.env.VERYFI_CLIENT_ID;
        const VERYFI_USERNAME = process.env.VERYFI_USERNAME;
        const VERYFI_API_KEY = process.env.VERYFI_API_KEY;

        const response = await axios.post(
            'https://api.veryfi.com/api/v8/partner/documents',
            { file_url },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'CLIENT-ID': VERYFI_CLIENT_ID,
                    Authorization: `apikey ${VERYFI_USERNAME}:${VERYFI_API_KEY}`,
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Veryfi API error:', error.response?.data || error.message);
        return NextResponse.json(
            { error: error.response?.data?.error || 'Internal Server Error' },
            { status: error.response?.status || 500 }
        );
    }
}
