import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Suara Tunggal Resmi: Alice (Gaya Announcer Penyiar Stasiun / Retail - Artikulasi Jelas)
const ALICE_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';

const ELEVENLABS_VOICES = [
  { id: ALICE_VOICE_ID, name: 'Alice (Penyiar Resmi KAI & Ruang Periksa)', gender: 'female' },
];

// Simple in-memory audio cache to conserve ElevenLabs quota
const AUDIO_CACHE = new Map<string, { buffer: Buffer; contentType: string }>();

export async function GET() {
  const hasKey = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim() !== '');
  return NextResponse.json({
    available: hasKey,
    voices: ELEVENLABS_VOICES,
    defaultVoiceId: ALICE_VOICE_ID,
  });
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'ELEVENLABS_API_KEY belum diset di .env',
          fallback: true,
        },
        { status: 200 }
      );
    }

    const body = await req.json();
    const { text, voiceId = ALICE_VOICE_ID } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text wajib diisi' }, { status: 400 });
    }

    // Selalu kunci ke suara Alice (Penyiar Resmi)
    const targetVoiceId = ALICE_VOICE_ID;
    const cacheKey = `${targetVoiceId}_${text.trim()}`;
    if (AUDIO_CACHE.has(cacheKey)) {
      const cached = AUDIO_CACHE.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cached.buffer), {
        status: 200,
        headers: {
          'Content-Type': cached.contentType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }

    // Call ElevenLabs API v1 with multilingual v2 model (KAI Train Station Announcer Setting)
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.82, // Sangat stabil, artikulasi tegas tanpa belibet
          similarity_boost: 0.85,
          style: 0.0, // Netral, berwibawa, jernih khas penyiar stasiun kereta
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('ElevenLabs API returned non-OK:', response.status, errorText);
      return NextResponse.json(
        {
          error: `ElevenLabs Error: ${response.statusText}`,
          fallback: true,
        },
        { status: 200 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to cache
    AUDIO_CACHE.set(cacheKey, { buffer, contentType: 'audio/mpeg' });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error generating ElevenLabs audio:', error);
    return NextResponse.json(
      {
        error: 'Gagal memproses ElevenLabs audio',
        fallback: true,
      },
      { status: 200 }
    );
  }
}
