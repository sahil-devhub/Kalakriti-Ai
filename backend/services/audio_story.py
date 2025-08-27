# --- FINAL LIVE AI VERSION ---
from pydub import AudioSegment
from io import BytesIO

def create_audio_story(voice_content: bytes) -> bytes:
    """
    The main function for Feature #3. It acts as a mini audio engineer.
    It takes the artisan's raw audio, mixes it with background music,
    and returns a polished MP3 file.

    Args:
        voice_content: The binary content of the artisan's voice recording.
    
    Returns:
        The binary content of the final, mixed MP3 file, or None on error.
    """
    try:
        # Step 1: Load the audio files from memory
        voice_recording = AudioSegment.from_file(BytesIO(voice_content))
        
        # Load the background music from our assets folder
        background_music = AudioSegment.from_mp3("backend/assets/music.mp3")

        # Step 2: Prepare the mix
        # Reduce the background music's volume by 10 dB to make it subtle
        subtle_music = background_music - 10

        # Step 3: Overlay the voice on top of the music
        mixed_audio = subtle_music.overlay(voice_recording)

        # Step 4: Normalize the final audio to a consistent volume
        final_audio = mixed_audio.normalize()

        # Step 5: Export the final audio to an in-memory buffer
        buffer = BytesIO()
        final_audio.export(buffer, format="mp3")
        
        return buffer.getvalue()

    except Exception as e:
        print(f"Error creating audio story: {e}")
        return None