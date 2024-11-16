import { useState } from "react";
import { Play, Pause, StopCircle, XCircle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

const TextToSpeech = () => {
  const [fileContent, setFileContent] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [synth, setSynth] = useState(window.speechSynthesis || null);
  const [utterance, setUtterance] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [error, setError] = useState(""); // Track error message
  const [timeoutError, setTimeoutError] = useState(false); // Track timeout state

  const timeoutDuration = 10000; // 10 seconds timeout for fetching content

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      setError(""); // Clear any previous error messages
      setTimeoutError(false); // Reset timeout error state

      const fileType = file.type;

      if (fileType === "application/pdf") {
        // Handle PDF files
        handlePdfUpload(file);
      } else if (
        fileType === "application/msword" ||
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // Handle DOCX files
        handleDocxUpload(file);
      } else {
        alert("Please upload a valid PDF or Word document.");
        setIsLoading(false);
      }
    }
  };

  const handlePdfUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      // Use pdf.js to read the PDF content
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);

      loadingTask.promise
        .then((pdf) => {
          let textContent = "";
          const totalPages = pdf.numPages;
          const promises = [];
          for (let i = 1; i <= totalPages; i++) {
            promises.push(
              pdf.getPage(i).then((page) => {
                return page.getTextContent().then((text) => {
                  textContent += text.items
                    .map((item: any) => item.str)
                    .join(" ");
                });
              })
            );
          }

          Promise.all(promises).then(() => {
            setFileContent(textContent);
            setIsLoading(false);
          });
        })
        .catch((err) => {
          console.error("Error reading PDF:", err);
          setError("Failed to fetch file content. Please try again.");
          setIsLoading(false);
        });
    };
    reader.readAsArrayBuffer(file);

    // Timeout for fetching the content
    setTimeout(() => {
      if (isLoading) {
        setTimeoutError(true);
        setError("Failed to fetch file content within the specified time.");
        setIsLoading(false);
      }
    }, timeoutDuration);
  };

  const handleDocxUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const arrayBuffer = e.target.result;
      // Use mammoth.js to extract the text from DOCX
      mammoth
        .extractRawText({ arrayBuffer })
        .then((result) => {
          setFileContent(result.value);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error parsing DOCX file:", err);
          setError("Failed to fetch file content. Please try again.");
          setIsLoading(false);
        });
    };
    reader.readAsArrayBuffer(file);

    // Timeout for fetching the content
    setTimeout(() => {
      if (isLoading) {
        setTimeoutError(true);
        setError("Failed to fetch file content within the specified time.");
        setIsLoading(false);
      }
    }, timeoutDuration);
  };

  const startSpeech = () => {
    if (synth.speaking) {
      alert("Already speaking. Please stop first.");
      return;
    }

    const newUtterance: any = new SpeechSynthesisUtterance(fileContent);
    newUtterance.onend = () => setIsPlaying(false);
    newUtterance.onerror = () => setIsPlaying(false);

    synth.speak(newUtterance);
    setUtterance(newUtterance);
    setIsPlaying(true);
  };

  const pauseSpeech = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPlaying(false);
    }
  };

  const resumeSpeech = () => {
    if (synth.paused) {
      synth.resume();
      setIsPlaying(true);
    }
  };

  const stopSpeech = () => {
    if (synth.speaking) {
      synth.cancel();
      setIsPlaying(false);
    }
  };

  const removeFile = () => {
    setFileContent("");
    setIsLoading(false);
    setError("");
    setTimeoutError(false); // Reset timeout error state
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto p-8 ">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Text to Speech
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Upload a Word or PDF document, preview its content, and convert it to
          speech.
        </p>

        {/* File Upload */}
        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="fileUpload"
          >
            Upload File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="fileUpload"
            accept=".pdf, .doc, .docx"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Fetching file content...</p>
          </div>
        )}

        {/* Timeout Error Message */}
        {timeoutError && !isLoading && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {/* File Content Error Message */}
        {error && !timeoutError && !isLoading && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {/* File Preview */}
        {fileContent && !isLoading && !error && (
          <section className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              File Preview
            </h3>
            <div className="overflow-y-auto max-h-60 border p-3 rounded-lg text-gray-800">
              {fileContent.slice(0, 500)} {/* Preview first 500 chars */}
            </div>
            <button
              onClick={removeFile}
              className="flex items-center text-red-500 hover:text-red-700 mt-2"
            >
              <XCircle size={20} className="mr-2" />
              Remove File
            </button>
          </section>
        )}

        {/* Speech Controls */}
        {fileContent && (
          <div className="flex items-center justify-center space-x-4 mt-4">
            <button
              onClick={startSpeech}
              className={`flex items-center px-4 py-2 rounded-lg text-white ${
                isPlaying ? "bg-gray-300" : "bg-green-600 hover:bg-green-700"
              } transition`}
              disabled={isPlaying || !fileContent}
            >
              <Play size={20} className="mr-1" />
              Play
            </button>
            <button
              onClick={pauseSpeech}
              className="flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
              disabled={!isPlaying}
            >
              <Pause size={20} className="mr-1" />
              Pause
            </button>
            <button
              onClick={resumeSpeech}
              className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
              disabled={!synth.paused}
            >
              <Play size={20} className="mr-1" />
              Resume
            </button>
            <button
              onClick={stopSpeech}
              className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              disabled={!isPlaying}
            >
              <StopCircle size={20} className="mr-1" />
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
