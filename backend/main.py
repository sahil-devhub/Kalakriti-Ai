import os
import json
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
# Note: 'audio_story' import is REMOVED
from services import marketing_copilot, brand_studio
from dotenv import load_dotenv

load_dotenv()

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

app = Flask(__name__,
            static_folder=os.path.join(project_root, 'frontend/build'),
            static_url_path='/')

CORS(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# --- API Endpoint for Marketing Kit ---
@app.route('/api/generate-kit', methods=['POST'])
@app.route('/api/generate-marketing-kit', methods=['POST']) 
def generate_kit_route():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("ERROR: Google API Key missing")
        return jsonify({"error": "Google API key is not configured on the server."}), 500
    
    if 'image' not in request.files or 'audio' not in request.files:
        return jsonify({"error": "Missing image or audio file."}), 400
        
    image_content = request.files['image'].read()
    audio_content = request.files['audio'].read()
    platform = request.form.get('platform', 'instagram')

    try:
        result = marketing_copilot.generate_full_kit(
            image_content, audio_content, platform, api_key
        )
        if result.get("error"):
            print(f"LOGIC ERROR: {result.get('error')}")
            return jsonify(result), 500
        return jsonify(result), 200
    except Exception as e:
        print(f"CRITICAL SERVER ERROR: {e}")
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

# --- API Endpoint for Brand Kit ---
@app.route('/api/generate-brand-kit', methods=['POST'])
def generate_brand_kit_route():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return jsonify({"error": "Google API key is not configured."}), 500
    image_files = request.files.getlist('images')
    if not image_files:
        return jsonify({"error": "No image files provided."}), 400
    image_contents = [file.read() for file in image_files]
    try:
        result = brand_studio.generate_brand_kit(image_contents, api_key)
        if result.get("error"):
            return jsonify(result), 500
        return jsonify(result), 200
    except Exception as e:
        print(f"BRAND KIT ERROR: {e}")
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

if __name__ == '__main__':
    print("Server starting on port 5000...")
    app.run(host='127.0.0.1', port=5000, debug=True)