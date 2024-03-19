"use client";
import React, { useState } from "react";

const RecordAudio = () => {
  const [recording, setRecording] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]); // Explicitly specify the type

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        setAudioChunks((prev: Blob[]) => [...prev, event.data]);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setRecording(false);
    const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
    const formData = new FormData();
    formData.append("file", audioBlob, "myrec.mp3");

    fetch("https://chat.fagoondigital.com/api/prompt/", {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "multipart/form-data",
        "Accept-Encoding": "gzip, deflate, br"
      },
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log("Response:", data);
      })
      .catch((error) => {
        console.error("Error sending audio:", error);
      });
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
};

export default RecordAudio;
