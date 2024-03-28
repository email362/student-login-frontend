// src/hooks/useFileReader.js

import { useState } from 'react';

export const useFileReader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const readFile = (file, callback = data => data) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        resolve(callback(data));
      };
      reader.onerror = (e) => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setError(null);
    }
  };

  return { file, error, readFile, handleFileChange };
};