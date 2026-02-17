import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

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
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    // Get the image file
    const imageFile = files.image?.[0] || files.image;
    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Received image file:', imageFile.originalFilename, 'Size:', imageFile.size);

    // Read the file and convert to base64
    const fileBuffer = fs.readFileSync(imageFile.filepath);
    const base64Image = fileBuffer.toString('base64');
    
    // Determine mime type
    const mimeType = imageFile.mimetype || 'image/jpeg';

    // Call OpenAI Vision API
    console.log('Calling OpenAI Vision API for OCR...');
    
    let visionResponse;
    try {
      visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // Using gpt-4o which supports vision
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Extrahiere den gesamten Text aus diesem Bild. Gib NUR den reinen Text zurück, ohne zusätzliche Erklärungen oder Formatierung. Wenn es ein Buch oder gedruckter Text ist, transkribiere ihn Wort für Wort genau so wie er im Bild steht.'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Image}`,
                    detail: 'high' // High detail for better OCR accuracy
                  }
                }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0 // Low temperature for more deterministic output
        })
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({ 
        error: 'Network error calling OpenAI',
        message: fetchError.message 
      });
    }

    // Read response text first for better error handling
    const responseText = await visionResponse.text();
    console.log('OpenAI response status:', visionResponse.status);
    console.log('OpenAI response preview:', responseText.substring(0, 200));

    if (!visionResponse.ok) {
      console.error('OpenAI Vision API error:', visionResponse.status, responseText);
      
      // Try to parse as JSON for better error message
      let errorMessage = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.error?.message || errorJson.error || responseText;
      } catch (e) {
        // Not JSON, use raw text
      }
      
      return res.status(visionResponse.status).json({ 
        error: 'Vision API error',
        details: errorMessage 
      });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was:', responseText);
      return res.status(500).json({ 
        error: 'Invalid response from OpenAI',
        details: 'Response was not valid JSON'
      });
    }

    const extractedText = result.choices?.[0]?.message?.content?.trim() || '';
    
    console.log('OCR successful, extracted text length:', extractedText.length);

    // Clean up temp file
    try {
      fs.unlinkSync(imageFile.filepath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }

    // Return the extracted text
    return res.status(200).json({
      text: extractedText,
      wordCount: extractedText.split(/\s+/).filter(w => w.length > 0).length
    });

  } catch (error) {
    console.error('OCR error:', error);
    return res.status(500).json({ 
      error: 'OCR failed',
      message: error.message 
    });
  }
}
