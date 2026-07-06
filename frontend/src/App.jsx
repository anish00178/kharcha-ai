import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function App() {
  // Expense List
  const [expenses] = useState([
    { id: 1, name: "Tea", amount: 20 },
    { id: 2, name: "Bus Ticket", amount: 50 },
    { id: 3, name: "Lunch", amount: 150 },
  ]);

  // Voice Recognition States
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Receipt Scanner State
  const [isScanning, setIsScanning] = useState(false);

  // ==========================
  // Voice Recognition
  // ==========================
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Your browser does not support Voice Recognition. Please use Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
    };

    recognition.onerror = () => {
      alert("Voice recognition failed.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // ==========================
  // Receipt Scanner
  // ==========================
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setIsScanning(true);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const imageBase64 = reader.result.split(",")[1];

      try {
        const response = await fetch(
          "http://localhost:5000/api/scan-receipt",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              imageBase64,
            }),
          }
        );

        const data = await response.json();

        alert("Receipt Scanned Successfully!\n\n" + data.result);
      } catch (error) {
        console.error(error);
        alert("Failed to scan receipt.");
      }

      setIsScanning(false);
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mt-10 mb-10">
        Kharcha-AI Dashboard
      </h1>

      {/* Voice Button */}
      <div className="mb-6 flex flex-col items-center">

        <Button
          onClick={startListening}
          className={`w-40 h-40 rounded-full text-xl text-white shadow-lg transition-all ${
            isListening
              ? "bg-red-500 animate-pulse"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isListening ? "🎤 Listening..." : "🎤 Record"}
        </Button>

        {/* Upload Button */}

        <div className="mt-5">
          <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-lg shadow">

            {isScanning
              ? "⏳ Scanning..."
              : "📷 Upload Receipt"}

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileUpload}
            />

          </label>
        </div>

        {/* Transcript */}

        {transcript && (
          <div className="mt-6 bg-white shadow rounded-lg p-4 w-full max-w-md">

            <h3 className="font-semibold text-lg mb-2">
              You said:
            </h3>

            <p className="text-gray-700">
              "{transcript}"
            </p>

          </div>
        )}

      </div>

      {/* Expense List */}

      <div className="w-full max-w-md">

        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Recent Spending
        </h2>

        {expenses.map((expense) => (

          <Card key={expense.id} className="mb-3">

            <CardContent className="p-4 flex justify-between items-center">

              <span className="font-medium text-gray-800">
                {expense.name}
              </span>

              <span className="text-red-500 font-bold">
                ₹{expense.amount}
              </span>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>
  );
}