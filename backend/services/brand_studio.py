# --- FINAL UPGRADED LIVE AI VERSION ---
import base64
import json
from google import genai
from vertexai.preview.vision_models import ImageGenerationModel # We still use this for logo creation

def generate_brand_kit(image_contents: list[bytes]) -> str:
    """
    Generates a brand kit using the new genai client.
    """
    try:
        client = genai.Client(project="kalakriti-ai", location="us-central1")
    except Exception as e:
        return json.dumps({"error": "Failed to initialize AI client."})

    image_parts = [{"mime_type": "image/jpeg", "data": content} for content in image_contents]

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

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=image_parts + [text_prompt],
        )
        strategy_json = json.loads(response.text)
        logo_prompt_from_gemini = strategy_json.get("logoPrompt")
    except Exception as e:
        print(f"Error with Gemini analysis: {e}")
        return '{ "error": "Failed to generate brand strategy from Gemini." }'

    try:
        generation_model = ImageGenerationModel.from_pretrained("imagegeneration@005")
        images = generation_model.generate_images(prompt=logo_prompt_from_gemini)
        logo_image_bytes = images[0]._image_bytes
        logo_base64 = base64.b64encode(logo_image_bytes).decode('utf-8')

        strategy_json["generatedLogo"] = {
            "promptUsed": logo_prompt_from_gemini,
            "imageBase64": logo_base64
        }
        return json.dumps(strategy_json)
    except Exception as e:
        print(f"Error with Imagen logo generation: {e}")
        return '{ "error": "Failed to generate logo with Imagen." }'