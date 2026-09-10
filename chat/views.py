import os
from google import genai
from google.genai import types
from rest_framework.decorators import api_view
from rest_framework.response import Response

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

@api_view(['POST'])
def chat_view(request):
    user_message = request.data.get('message', '')
    history = request.data.get('history', [])

    gemini_contents = []
    for msg in history:
        role = 'user' if msg['sender'] == 'user' else 'model'
        gemini_contents.append(
            types.Content(role=role, parts=[types.Part(text=msg['text'])])
        )

    gemini_contents.append(
        types.Content(role='user', parts=[types.Part(text=user_message)])
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=gemini_contents,
        config=types.GenerateContentConfig(
            system_instruction="You have live Google Search available as a tool. You DO have access to real-time information such as current weather, news, and events — always use the search tool to answer questions about anything current, instead of saying you lack real-time access.",
            tools=[types.Tool(google_search=types.GoogleSearch())]
        ),
    )

    return Response({'reply': response.text})