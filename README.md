🎨 KalaKriti AI ✨
Bring your craft to the world. We'll tell your story.

<<<<<<< HEAD
Backend Command:-  
"cd backend"
"functions-framework --target=api"
"flask --app main run"  #For Local run
=======
KalaKriti AI is an AI-powered co-pilot designed to empower local artisans by bridging the digital marketing gap. By transforming an artisan's authentic story and artwork into a professional, ready-to-use marketing kit, our platform makes it easy for creators to thrive in the modern e-commerce landscape.
>>>>>>> 10f859686bd603e3b336c5c9e60c6cdbd4d259c5

Built for the GenAI Exchange Hackathon by Hack2skill & Google Cloud.

🚀 Live Demo
https://kalakriti-ai-15cf1.web.app/

📸 Screenshots
Here's a look at our application in action. The user provides their art and story, and KalaKriti AI generates a complete marketing kit.
<img width="500" height="350" alt="unnamed (1)" src="https://github.com/user-attachments/assets/f5653afe-070a-4f75-8ef1-e0d2289413a3" />
<img width="500" height="350" alt="unnamed" src="https://github.com/user-attachments/assets/1a3f8f06-4dcc-4181-87ec-a956df609852" />



Input Interface	Generated Marketing Kit
The user uploads an image of their art and a short audio story.	The AI generates a title, description, social caption, and more.

🎯 The Problem We Solve
Many gifted local artisans are excluded from the digital marketplace due to a lack of technical skills and marketing expertise. They can create beautiful art but struggle to craft the compelling online narratives needed to connect with a global audience. This "digital divide" severely limits their income potential and the preservation of their unique cultural heritage.

✨ Features
🤖 AI Marketing Kit Generation: The core feature. Upload an image and an audio story to instantly generate a product title, a poetic e-commerce description, social media captions, and a narrative about the artisan's process.

🎨 AI Brand Studio: Analyzes a collection of an artisan's work to generate cohesive branding elements, including brand name suggestions, taglines, a color palette, and an AI-generated logo concept.

🎶 Audio Story Enhancer: Automatically mixes the artisan's raw voice recording with subtle background music to produce a polished, shareable audio story for social media or websites.

🛠️ Tech Stack & Architecture
Our solution is built on a modern, serverless architecture using Google Cloud's powerful AI services.

Frontend: React.js, Tailwind CSS

Backend: Python, Flask

Deployment:

Monolithic Service: Deployed as a single service on Google App Engine.

Previous Architecture: Also supports a microservices architecture with the backend on Google Cloud Functions and the frontend on Firebase Hosting.

Generative AI APIs:

Google Vertex AI (Gemini Models): For multimodal analysis and all text generation.

Google Cloud Speech-to-Text API: For accurate audio transcription.

⚙️ Getting Started
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js and npm

Python 3.9+ and pip

Google Cloud SDK (gcloud CLI) installed and authenticated.

Installation
Clone the repo

Bash

git clone [YOUR_REPO_URL]
Backend Setup

Bash

cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
pip install -r requirements.txt
# You will also need to set up a Google Cloud service account and
# point to its JSON key file for local authentication.
Frontend Setup

Bash

cd ../frontend
npm install
Running Locally

Run the backend server from the backend directory: flask run

Run the frontend dev server from the frontend directory: npm start

📄 License
Distributed under the MIT License. See LICENSE for more information.
