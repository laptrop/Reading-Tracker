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
    formData.append('response_format', 'verbose_json'); // Enables word-level timestamps
    formData.append('timestamp_granularities[]', 'word'); // Word-level timestamps
    // Hint to Whisper to preserve reading errors and avoid hallucinations
    formData.append('prompt', 'Ein Kind liest einen deutschen Text vor. Transkribiere nur das Gesprochene, exakt wie es gesagt wird. Keine Korrekturen, keine Ergänzungen.');

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
    
    // Filter known Whisper hallucinations
    const hallucinations = [
      'untertitel der amara.org-community',
      'untertitel von',
      'amara.org',
      'vielen dank für ihre aufmerksamkeit',
      'thank you for watching',
      'untertitel',
    ];
    
    let transcribedText = result.text.trim();
    
    // Remove hallucinated phrases from end of text
    for (const phrase of hallucinations) {
      const lowerText = transcribedText.toLowerCase();
      const idx = lowerText.lastIndexOf(phrase);
      if (idx !== -1) {
        console.log(`Removing hallucination: "${phrase}" at position ${idx}`);
        transcribedText = transcribedText.substring(0, idx).trim();
      }
    }
    
    console.log('Transcription successful:', transcribedText.substring(0, 80) + '...');

    // Clean up temp file
    try {
      fs.unlinkSync(audioFile.filepath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }

    // Return the transcription
    return res.status(200).json({
      text: transcribedText,
      duration: result.duration,
      words: result.words || [],  // [{word, start, end}, ...] for fluency analysis
    });

  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(500).json({ 
      error: 'Transcription failed',
      message: error.message 
    });
  }
}
