from pydub import AudioSegment
from io import BytesIO
import os
import math

# CRITICAL FIX (A): EXPLICITLY SET FFMPEG AND FFPROBE PATHS
# (These lines must be at the top of your audio_story.py file)
AudioSegment.converter = "C:\\ffmpeg\\bin\\ffmpeg.exe"
AudioSegment.R_PATH = "C:\\ffmpeg\\bin\\ffprobe.exe" 


def create_audio_story(voice_content: bytes) -> bytes | str:
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        music_path = os.path.join(base_dir, '..', 'assets', 'music.mp3')

        voice_recording = None
        
        # CRITICAL FIX (B): Multi-Format Loading (NOW INCLUDES OPUS)
        # We try the most common formats for browser-recorded audio.
        for fmt in ["opus", "ogg", "wav", "mp3", "webm"]: 
            try:
                # Use a fresh BytesIO stream for each attempt
                voice_recording = AudioSegment.from_file(BytesIO(voice_content), format=fmt)
                print(f"Successfully loaded audio as format: {fmt}")
                break  # Stop the loop immediately on success
            except:
                pass 

        if voice_recording is None:
             raise ValueError(
                 "Failed to load voice content. The audio format sent by the browser "
                 "is not recognized (tried opus, ogg, wav, mp3, webm)."
             )


        background_music = AudioSegment.from_mp3(music_path)

        # --- Existing Mixing Logic ---
        subtle_music = background_music - 12
        voice_duration = len(voice_recording)
        
        if len(subtle_music) < voice_duration:
            times_to_loop = math.ceil(voice_duration / len(subtle_music))
            looped_music = subtle_music * times_to_loop
            music_for_mix = looped_music[:voice_duration]
        else:
            music_for_mix = subtle_music[:voice_duration]

        mixed_audio = music_for_mix.overlay(voice_recording)
        final_audio = mixed_audio.normalize()
        buffer = BytesIO()
        final_audio.export(buffer, format="mp3")
        
        return buffer.getvalue()
        
    except Exception as e:
        error_message = (
            "Audio processing failed. This is almost always because FFmpeg is not installed "
            "or not found in your system's PATH. Please ensure FFmpeg is correctly installed. "
            f"Detailed Pydub Error: {e}"
        )
        print(f"--- DETAILED AUDIO STORY ERROR ---: {error_message}")
        return error_message