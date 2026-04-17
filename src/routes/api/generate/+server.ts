// src/routes/api/search/+server.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { streamText } from 'ai';
import { type RequestEvent } from '@sveltejs/kit';
import { createGroq } from '@ai-sdk/groq';
import { json } from '@sveltejs/kit';

export async function POST({ fetch, request }: RequestEvent) {
  const { prompt, userApiKey, nameApiKey } = await request.json();
  console.log('userApiKey:', userApiKey);
  console.log('nameApiKey:', nameApiKey);
  console.log('Prompt recibido:', prompt);

  if (nameApiKey === "brave") {
    const res = await fetch('https://api.search.brave.com/res/v1/chat/completions', {
      method: 'POST',
      headers: {
        'X-Subscription-Token': userApiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "stream": false,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      return json({ error: 'Error en Brave API', details: error }, { status: res.status });
    }

    const data = await res.json();
    //console.log(data)
    return json(data);

  } else if (nameApiKey === "gemini") {
    /*
    const ai = new GoogleGenAI({
      apiKey: userApiKey
    });
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config,
    });
    console.log(response.text);
    */
    /*
      const genAI = new GoogleGenerativeAI(userApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent(prompt);
      console.log(result)
      console.log(result.response)
      */

    try {
      const genAI = new GoogleGenerativeAI(userApiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        tools: [
          {
            // @ts-ignore: El SDK puede no tener el tipo actualizado para v2.5 aún
            googleSearch: {} 
          }
        ],
      });

      const result = await model.generateContent(prompt);

      // El texto generado
      const textoRespuesta = result.response.text();
      //console.log({ actividad: textoRespuesta });
      return json({ data: textoRespuesta });

    } catch (error: any) {
      if (error.status === 429) {
        console.error("Cuota excedida: Espera un minuto antes de reintentar.");
      } else {
        console.error("Error en la petición:", error.message);
      }
    }



  } else if (nameApiKey === "groq") {
    const groq = createGroq({
      apiKey: userApiKey
    });

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `${prompt}`
    });
    let fullResponse = '';
    for await (const delta of result.fullStream) {
      if (delta.type === "text-delta") {
        fullResponse += delta.text;
      }
    }
    //console.log("=========================================");
    //console.log(fullResponse)
    //console.log("=========================================");
    //console.log(JSON.parse(fullResponse))
    //const respuesta = JSON.parse(fullResponse);
    return json({ 
      success: true, 
      data: fullResponse 
    });

  } else if (nameApiKey === "mistral") {

    const response = await fetch("https://api.mistral.ai/v1/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userApiKey}`
      },
      body: JSON.stringify({
        model: "mistral-medium-latest",
        inputs: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    //console.log(data)

    return json({ 
      success: true, 
      data: data 
    });
  //return new Response(JSON.stringify(data), { status: 200 });
  }

}




/*
import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { type RequestEvent, json } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  const { prompt, userApiKey } = await request.json();

  const groq = createGroq({
    apiKey: userApiKey
  });

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    prompt: `${prompt}`
  });
  let fullResponse = '';
  for await (const delta of result.fullStream) {
    if (delta.type === "text-delta") {
      fullResponse += delta.text;
    }
  }
  console.log("=========================================");
  console.log(fullResponse)
  console.log("=========================================");
  //console.log(JSON.parse(fullResponse))
  //const respuesta = JSON.parse(fullResponse);
  return json({ 
    success: true, 
    data: fullResponse 
  });

}
*/

/*
import { type RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const contextoEducativo = [
    "explicación didáctica",
    "guía para estudiantes",
    "recursos educativos",
    "ejemplos prácticos"
  ];

export async function POST({ fetch, request }: RequestEvent) {
  const { prompt, userApiKey } = await request.json();
  console.log('userApiKey:', userApiKey);
  console.log('Prompt recibido:', prompt);

  const queryBase = `${prompt} ${contextoEducativo.join(' OR ')}`;

  //const consultaLimpia = prompt.replace(/\n/g, ' ');
  console.log(queryBase)

  const res = await fetch('https://api.search.brave.com/res/v1/llm/context', {
    method: 'POST',
    headers: {
      'X-Subscription-Token': userApiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      q: prompt,
      search_lang: 'es',
      count: 8,
      maximum_number_of_tokens: 4000,        // Ajusta según el contexto de tu LLM
      maximum_number_of_urls: 5,
      maximum_number_of_tokens_per_url: 1500,
      context_threshold_mode: 'balanced',     // 'strict' si quieres solo lo más relevante
      safesearch: 'strict'                    // Muy recomendable para contenido educativo
    })
  });

  if (!res.ok) {
    const error = await res.text();
    return json({ error: 'Error en Brave API', details: error }, { status: res.status });
  }

  const data = await res.json();
  console.log(data)
  return json(data);

  //const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${prompt}`, {
  //  headers: {
  //    'X-Subscription-Token': "BSAobwVHUcB5sMFmi8x3sbLoB9KhDN7",
  //  },
  //});
  //const data = await response.json();
  //return json(data);

}
*/

/*
import { type RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function POST({ fetch, request }: RequestEvent) {
  try {
    const { prompt } = await request.json();
    console.log('📝 Prompt recibido:', prompt);

    //const response = await fetch('http://localhost:11434/api/generate', {
    const response = await fetch('https://ollama.lavanderiasandra.co/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3',
        prompt: prompt,
        stream: false,
      }),
    });
    
    console.log('✅ Respuesta de Ollama - Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de Ollama:', errorText);
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Datos recibidos de Ollama');
    //console.log({ response: JSON.parse(data.response) });
    //return json({ response: JSON.parse(data.response) });
    return json({ response: data.response });

  } catch (error) {
  console.error('❌ Error en el servidor:', error);
    console.error('❌ Stack:', error);
    return json(
      { error: `Error: ${error}` },
      { status: 500 }
    );
  }
}
*/


// src/routes/api/ollama/+server.ts
/*
import { type RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export async function POST({ fetch, request }: RequestEvent) {
  try {
    const { prompt } = await request.json();

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'glm-5:cloud',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return json({ response: data.response });
  } catch (error) {
    return json(
      { error: 'Error al comunicarse con Ollama' },
      { status: 500 }
    );
  }
}
*/

/*

import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch, request }) => {
    const { prompt } = await request.json();

    // Configuramos la petición a Ollama
    // 'stream: true' permite recibir la respuesta poco a poco
    console.log(prompt)
    const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama3', // Cambia esto por tu modelo instalado (ej. llama3, mistral, etc.)
            messages: prompt,
            stream: true
        })
    });

    if (!ollamaResponse.ok) {
        return json({ error: 'Error al conectar con Ollama' }, { status: 500 });
    }

    // Creamos un ReadableStream para enviar la respuesta en tiempo real al frontend
    const stream = new ReadableStream({
        async start(controller) {
            const reader = ollamaResponse.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                controller.close();
                return;
            }

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    
                    // Ollama envía líneas JSON separadas por saltos de línea
                    // Las enviamos tal cual al frontend
                    controller.enqueue(chunk);
                }
            } catch (error) {
                console.error(error);
            } finally {
                controller.close();
            }
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream', // Importante para el streaming
            'Connection': 'keep-alive'
        }
    });
};
*/






/*
import { type RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
  const { prompt } = await request.json();

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-5:cloud', // o el modelo que tengas cargado
        prompt: prompt,
        stream: false, // para obtener toda la respuesta de una vez
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      body: { response: data.response },
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: 'Error al comunicarse con Ollama' },
    };
  }
};
*/



/*

import { json, type RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
    try {
        const { prompt, userApiKey } = await request.json();

        if (!userApiKey || !userApiKey.startsWith('sk-or-v1-')) {
            return json({ error: "API Key de OpenRouter inválida." }, { status: 400 });
        }

        // Lista de modelos gratuitos por orden de prioridad
        // Si el primero falla, el sistema de OpenRouter a veces da error de "No endpoints"
        const models = [
            "google/gemini-2.0-flash-lite-preview:free",
            "google/gemini-2.0-pro-exp-02-05:free",
            "mistralai/mistral-7b-instruct:free"
        ];

    // ... (resto del código anterior igual)

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${userApiKey.trim()}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173", 
                "X-Title": "LocalSchoolApp"
            },
            body: JSON.stringify({
                // Prueba con este ID que es el estándar actual para el tier gratuito
                "model": "mistralai/mistral-7b-instruct:free", 
                "messages": [
                    { "role": "user", "content": `Genera una actividad escolar sobre: ${prompt}` }
                ]
            })
        });

// ...

        const data = await response.json();

        if (data.error) {
            // Si el error es específicamente de "No endpoints", avisamos al usuario
            if (data.error.message.includes("No endpoints found")) {
                return json({ 
                    error: "El modelo gratuito está saturado. Prueba de nuevo en unos segundos o cambia el modelo en el código." 
                }, { status: 503 });
            }
            return json({ error: data.error.message }, { status: 400 });
        }

        return json({ actividad: data.choices[0].message.content });

    } catch (error: any) {
        return json({ error: "Error de servidor: " + error.message }, { status: 500 });
    }
}
*/
