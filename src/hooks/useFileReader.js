// src/hooks/useFileReader.js

import { useState, useCallback } from 'react';

export const useFileReader = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const readFile = useCallback( (file, callback = data => data) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        resolve(callback(data));
      };
      reader.onerror = (e) => {
        console.log(e);
        setError(new Error("Failed to read file"));
        reject(new Error("Failed to read file"));
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const handleFileChange = (inputFile) => {
    console.log("handleFileChange", inputFile);
    // get file object
    if (inputFile) {
      setFile(inputFile);
      setError(null);
    } else {
      setFile(null);
      setError("Please select a file");
    }
  };

  return { file, error, readFile, handleFileChange };
};