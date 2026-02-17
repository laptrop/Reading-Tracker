import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY not found in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Parse the multipart form data
    const form = formidable({
      maxFileSize: 25 * 1024 * 1024, // 25MB limit
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Get the audio file
    const audioFile = files.audio?.[0] || files.audio;
    if (!audioFile) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    console.log('Received audio file:', audioFile.originalFilename, 'Size:', audioFile.size);

    // Read the file
    const fileBuffer = fs.readFileSync(audioFile.filepath);

    // Create form data for Whisper API
    const formData = new FormData();
    formData.append('file', fileBuffer, {
      filename: audioFile.originalFilename || 'audio.webm',
      contentType: audioFile.mimetype || 'audio/webm',
    });
    formData.append('model', 'whisper-1');
    formData.append('language', 'de'); // German language
    // Hint to Whisper to preserve reading errors - don't autocorrect
    formData.append('prompt', 'Ein Kind liest einen Text vor. Transkribiere exakt was gesagt wird, auch wenn es Lesefehler, Versprecher oder falsche Wörter gibt. Korrigiere nichts.');

    // Call Whisper API
    console.log('Calling Whisper API...');
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!whisperResponse.ok) {
      const errorText = await whisperResponse.text();
      console.error('Whisper API error:', whisperResponse.status, errorText);
      return res.status(whisperResponse.status).json({ 
        error: 'Whisper API error',
        details: errorText 
      });
    }

    const result = await whisperResponse.json();
    console.log('Transcription successful:', result.text.substring(0, 50) + '...');

    // Clean up temp file
    try {
      fs.unlinkSync(audioFile.filepath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }

    // Return the transcription
    return res.status(200).json({
      text: result.text,
      duration: result.duration,
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ 
      error: 'Transcription failed',
      message: error.message 
    });
  }
}
