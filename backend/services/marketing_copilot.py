import base64
import json
import requests
import re

def generate_full_kit(image_content: bytes, audio_content: bytes, platform: str, api_key: str) -> dict:
    # 1. Prepare Image Data
    image_part = {
        "inline_data": {
            "mime_type": "image/jpeg",
            "data": base64.b64encode(image_content).decode('utf-8')
        }
    }

    # 2. Prepare Audio Data (audio/webm matches browser recording)
    audio_part = {
        "inline_data": {
            "mime_type": "audio/webm", 
            "data": base64.b64encode(audio_content).decode('utf-8')
        }
    }

    # 3. Define Platform Specifics
    hashtag_instruction = "Generate 30 high-traffic, niche-specific, and viral hashtags."
    if platform == 'instagram':
        hashtag_instruction = "Generate exactly 30 mixed (broad & niche) viral hashtags."

    # 4. Construct the Master Prompt
    text_prompt = f"""
    You are a world-class marketing copywriter.

    **Primary Goal:** Analyze the attached IMAGE and AUDIO (Artisan's Story) to create a viral social media kit for {platform}.

    **Instructions:**
    1. Listen to the audio. Identify the language.
    2. **Authenticity:** Use 2-3 powerful KEYWORDS from the story in *italics* with (translation).
    3. **Accuracy:** Do not invent words.

    **JSON Output Rules:**
    - Respond ONLY with a valid JSON object.
    - Structure:
    {{
      "productTitle": "Short catchy title",
      "productDescription": "Compelling description (70-90 words)",
      "productHighlights": "Story highlights using native words",
      "post": "Viral caption for {platform}. NO HASHTAGS HERE.",
      "hashtags": "{hashtag_instruction} Space separated tags."
    }}
    """

    parts = [
        {"text": text_prompt},
        image_part,
        audio_part
    ]

    try:
        # --- FIX: Updated to 'gemini-2.5-flash' as requested ---
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        
        payload = {
            "contents": [{"parts": parts}],
            "generationConfig": {
                "temperature": 0.7,
                "response_mime_type": "application/json"
            }
        }
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        
        response_json = response.json()

        if 'candidates' not in response_json or not response_json['candidates']:
            return {"error": "The AI model blocked the response (Safety Filter)."}

        generated_content = response_json['candidates'][0]['content']['parts'][0]['text']
        clean_json_str = generated_content.replace('```json', '').replace('```', '').strip()
        
        match = re.search(r'\{.*\}', clean_json_str, re.DOTALL)
        if match:
            clean_json_str = match.group(0)
            
        return json.loads(clean_json_str)

    except requests.exceptions.HTTPError as e:
        print(f"AI API ERROR: {e.response.text}") # Detailed error logging
        return {"error": f"AI API Error: {e.response.status_code}"}
    except Exception as e:
        print(f"AI ERROR DETAILS: {e}")
        return {"error": f"AI Error: {str(e)}"}