import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { modelType,model, apiKey, prompt, componentHtml } = await request.json();

    if (!modelType || !apiKey || !prompt) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: modelType, apiKey, and prompt are required" },
        { status: 400 }
      );
    }

    let result = "";

    // Enhance prompt with component HTML context if provided (componentHtml is optional)
    const enhancedPrompt = componentHtml 
      ? `Context: Here is the HTML component:\n${componentHtml}\n\nUser Request: ${prompt}`
      : prompt;

    // Test ChatGPT API
    if (modelType === "ChatGPT") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model:model,
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            {
              role: "user",
              content: enhancedPrompt,
            },
          ],
          max_tokens: 150,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: data.error?.message || "ChatGPT API request failed",
          },
          { status: response.status }
        );
      }

      result = data.choices?.[0]?.message?.content || "No response from ChatGPT";
    }
    // Test Gemini API
    else if (modelType === "Gemini") {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: enhancedPrompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: data.error?.message || "Gemini API request failed",
          },
          { status: response.status }
        );
      }

      result =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini";
    } else {
      return NextResponse.json(
        { success: false, error: "Unsupported model type" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      result: result,
    });
  } catch (error: any) {
    console.error("LLM Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An error occurred while testing the API",
      },
      { status: 500 }
    );
  }
}
