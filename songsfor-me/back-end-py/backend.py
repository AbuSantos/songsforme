from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import librosa
import numpy as np
import io
import soundfile as sf
import traceback

app = FastAPI()


@app.post("/analyze-audio/")
async def analyze_audio(file: UploadFile = File(...)):
    """
    Endpoint to analyze an uploaded audio file.
    Extracts audio features (tempo, spectral centroid, chroma, MFCC) and returns them as JSON.
    Converts stereo audio to mono and ensures all numerical values are native Python types.
    """
    try:
        # Read the uploaded file's contents as bytes
        contents = await file.read()
        audio_stream = io.BytesIO(contents)

        # Load audio data using soundfile (returns a NumPy array and sample rate)
        audio, sr = sf.read(audio_stream)
        print("Audio length (samples):", len(audio))

        # If audio is multi-channel (e.g., stereo), convert to mono
        if audio.ndim > 1:
            audio = librosa.to_mono(audio.T)
            print("Converted audio to mono.")

        # Ensure n_fft does not exceed the signal length
        n_fft = min(2048, len(audio))

        # Extract features using Librosa
        tempo, _ = librosa.beat.beat_track(y=audio, sr=sr)
        spectral_centroid = np.mean(librosa.feature.spectral_centroid(y=audio, sr=sr))
        chroma = np.mean(librosa.feature.chroma_stft(y=audio, sr=sr))
        mfcc_features = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13, n_fft=n_fft)

        # Convert MFCC features to a list of lists with native Python floats
        mfcc_list = [[float(x) for x in row] for row in mfcc_features.tolist()]

        # Build the features dictionary with native types
        features = {
            "tempo": float(tempo),  # Ensure tempo is a Python float
            "spectral_centroid": float(spectral_centroid),
            "chroma": float(chroma),
            "mfcc": mfcc_list,
        }

        return JSONResponse(content=jsonable_encoder(features), status_code=200)
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
