import { useState } from "react"; 
import { Button } from "./components/ui/button"; 
import { Card, CardContent } from "./components/ui/card"; 
export default function App() { 
  // Our digital memory box (State) 
  const [expenses, setExpenses] = useState([ 
    { id: 1, name: "       Tea", amount: 20 }, 
    { id: 2, name: "        Bus Ticket", amount: 50 }, 
    { id: 3, name: "                   Lunch", amount: 150 }, 
  ]); 
  return ( 
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6"> 
       
 
 
      {/* 1. The Title */} 
      <h1 className="text-3xl font-bold text-gray-800 mb-10 mt-10"> 
        Kharcha-AI Dashboard 
      </h1> 
      {/* 2. The Microphone Button */} 
      <div className="mb-12"> 
        <Button className="w-40 h-40 rounded-full text-xl shadow-lg bg-blue-600 hover:bg
blue-700 text-white"> 
              Record 
        </Button> 
      </div> 
      {/* 3. The Recent Spending List (Automated Loop) */} 
      <div className="w-full max-w-md"> 
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Spending</h2> 
         
        {expenses.map((item) => ( 
          <Card key={item.id} className="mb-3"> 
            <CardContent className="p-4 flex justify-between items-center"> 
              <span className="font-medium text-gray-800">{item.name}</span> 
              <span className="text-red-500 font-bold">₹{item.amount}</span> 
            </CardContent> 
          </Card> 
        ))} 
 
      </div> 
    </div> 
  ); 
}