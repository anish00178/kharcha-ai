import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

export default function App() {
  // Expense list
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Tea", amount: 20 },
    { id: 2, name: "Bus Ticket", amount: 50 },
    { id: 3, name: "Lunch", amount: 150 },
  ]);

  // Voice Recognition States
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Voice Recognition Function
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition. Please use Google Chrome.");
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

    recognition.onerror = (event) => {
      console.error(event.error);
      alert("Voice recognition failed.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mt-10 mb-10">
        Kharcha-AI Dashboard
      </h1>

      {/* Microphone Button */}
      <div className="mb-8 flex flex-col items-center">

        <Button
          onClick={startListening}
          className={`w-40 h-40 rounded-full text-xl shadow-lg text-white transition-all ${
            isListening
              ? "bg-red-500 animate-pulse"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isListening ? "🎤 Listening..." : "🎤 Record"}
        </Button>

        {/* Show Transcript */}
        {transcript && (
          <div className="mt-6 w-full max-w-md bg-white p-4 rounded-lg shadow text-center">
            <h3 className="font-semibold text-lg mb-2">
              You said:
            </h3>
            <p className="text-gray-700 text-lg">
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