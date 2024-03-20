"use client";
import React, { useState, useRef } from "react";

const RecordAudio = () => {
  const apiURL = "https://chat.fagoondigital.com/api/prompt/";
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!recording) {
      const fileList = event.target.files;
      if (fileList && fileList.length > 0) {
        setFile(fileList[0]);
      }
    }
    event.target.value = ""; // Reset the value of the input element
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      setError(
        "Error accessing microphone. Please allow microphone access and try again."
      );
    }
  };

  const stopRecording = async () => {
    setRecording(false);
    setLoading(true);

    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) {
      setError("MediaRecorder not initialized.");
      setLoading(false);
      return;
    }

    mediaRecorder.stop();

    if (audioChunks.length === 0) {
      setError("No audio recorded.");
      setLoading(false);
      return;
    }

    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    setAudioChunks([]);

    const formData = new FormData();
    formData.append("file", audioBlob, "recorded_audio.mp3");

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      const fagoonResponse = `Fagoon: ${responseData.response}`;
      setResponse(fagoonResponse);
    } catch (error) {
      setError(`Error sending audio: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("No file selected.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(apiURL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      setResponse(JSON.stringify(responseData, null, 2));
    } catch (error) {
      setError(`Error sending audio: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="record-audio-container">
      {/* <input type="file" onChange={handleFileChange} ref={inputFileRef} /> */}
      <div className="button-container">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={loading}
          className={`record-button ${recording ? "stop" : "start"} ${
            loading ? "disabled" : ""
          }`}
        >
          {loading
            ? "Processing..."
            : recording
            ? "Stop Recording"
            : "Start Recording"}
        </button>
        {/* <button
          onClick={handleSubmit}
          disabled={loading}
          className={`submit-button ${loading ? "disabled" : ""}`}
        >
          {loading ? "Processing..." : "Submit File"}
        </button> */}
      </div>
      {error && <div className="m-8 error-message">{error}</div>}
      {response && (
        <div className="response text-dark bg-white p-8 rounded-lg">
          {response}
        </div>
      )}
    </div>
  );
};

export default RecordAudio;
