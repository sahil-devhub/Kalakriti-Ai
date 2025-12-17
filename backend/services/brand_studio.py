import base64
import json
import requests

def generate_brand_kit(image_contents: list[bytes], api_key: str) -> dict:
    """
    Generates a brand kit and returns a clean dictionary.
    """
    if not image_contents:
        return {"error": "No images provided for brand analysis."}

    parts = [{"inline_data": {"mime_type": "image/jpeg", "data": base64.b64encode(content).decode('utf-8')}} for content in image_contents]

    text_prompt = """
    You are an expert brand designer for artisanal crafts. Analyze this collection of images.
    Identify the core artistic style, dominant colors, and recurring motifs.
    Respond ONLY with a valid JSON object with the following structure:
    {
      "brandNameSuggestions": ["Creative name 1", "Creative name 2"],
      "brandTaglineSuggestions": ["Catchy tagline 1", "Catchy tagline 2"],
      "colorPalette": ["#HEX1", "#HEX2", "#HEX3", "#HEX4"],
      "logoPrompt": "A detailed, descriptive prompt for an AI image generator to create a simple, elegant logo based on the art style."
    }
    """
    parts.insert(0, {"text": text_prompt})

    try:
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        
        payload = {"contents": [{"parts": parts}]}
        headers = {'Content-Type': 'application/json'}
        
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        
        response_json = response.json()
        strategy_text = response_json['candidates'][0]['content']['parts'][0]['text']
        
        # --- FIX: Clean the raw text before parsing ---
        json_start = strategy_text.find('{')
        json_end = strategy_text.rfind('}') + 1
        clean_str = strategy_text[json_start:json_end]
        strategy_json = json.loads(clean_str)
        
        logo_prompt_from_gemini = strategy_json.get("logoPrompt")
        strategy_json["generatedLogo"] = {
            "promptUsed": logo_prompt_from_gemini,
            "imageBase64": None
        }
        
        return strategy_json

    except requests.exceptions.HTTPError as e:
        error_details = e.response.json()
        error_message = error_details.get('error', {}).get('message', 'An unknown API error occurred.')
        return {"error": f"AI API Error (Brand Kit): {error_message}"}
    except Exception as e:
        return {"error": f"Failed to generate brand kit: {e}"}