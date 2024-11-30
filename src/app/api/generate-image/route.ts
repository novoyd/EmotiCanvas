// Import necessary types from Next.js and OpenAI
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with our API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define our POST handler for the /api/generate-image endpoint
export async function POST(request: Request) {
  try {
    // Parse the incoming request body to get the prompt
    const { prompt } = await request.json();

    // Validate that we received a prompt
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Call the DALL-E API to generate an image
    const response = await openai.images.generate({
      // Specify we want to use DALL-E 3 model
      model: "dall-e-3",
      
      // Pass our generated prompt
      prompt: prompt,
      
      // Request a single image
      n: 1,
      
      // Request 1024x1024 size image
      size: "1024x1024",
      
      // Set image quality to standard (can be "standard" or "hd")
      quality: "standard",
      
      // Specify the style (can be "vivid" or "natural")
      style: "vivid",
    });

    // Extract the generated image URL from the response
    const imageUrl = response.data[0].url;

    // Return the image URL in our response
    return NextResponse.json({ imageUrl });

  } catch (error) {
    // Log any errors for debugging
    console.error('Error generating image:', error);

    // Determine if it's an OpenAI API error
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';

    // Return an error response
    return NextResponse.json(
      { error: `Failed to generate image: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Optional: Add a GET handler to return an error for unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}