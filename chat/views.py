import os
from google import genai
from google.genai import types
from rest_framework.decorators import api_view
from rest_framework.response import Response

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

@api_view(['POST'])
def chat_view(request):
    user_message = request.data.get('message', '')
    history = request.data.get('history', [])  # list of {sender, text}

    # Convert our history into the shape Gemini expects
    gemini_contents = []
    for msg in history:
        role = 'user' if msg['sender'] == 'user' else 'model'
        gemini_contents.append(
            types.Content(role=role, parts=[types.Part(text=msg['text'])])
        )

    # Add the new message at the end
    gemini_contents.append(
        types.Content(role='user', parts=[types.Part(text=user_message)])
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=gemini_contents,
    )

    return Response({'reply': response.text})