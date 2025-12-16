import MistralClient from '@mistralai/mistralai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.MISTRAL_API_KEY) {
      return NextResponse.json({ error: 'La clau API de Mistral no està configurada.' }, { status: 500 });
    }

    const client = new MistralClient(process.env.MISTRAL_API_KEY);

    const chatResponse = await client.chat({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: message }],
    });

    return NextResponse.json(chatResponse);

  } catch (error) {
    console.error('Error en la trucada a la API de Mistral:', error);
    return NextResponse.json({ error: 'Error intern del servidor.' }, { status: 500 });
  }
}
