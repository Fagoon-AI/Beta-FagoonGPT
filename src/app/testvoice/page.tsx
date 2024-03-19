"use client";
import React, { useState } from "react";

const RecordAudio = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      setFile(fileList[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    fetch("https://chat.fagoondigital.com/api/prompt/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setResponse(`Fagoon: ${data.response}`);
      })
      .catch((error) => {
        console.error("Error sending audio:", error);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit</button>
      {response && <div>Response: {response}</div>}
    </div>
  );
};

export default RecordAudio;
