import React, { useState, useEffect } from "react";

interface TerminalProps {
  onCommand: (command: string) => string;
}

export default function Terminal({ onCommand }: TerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "Welcome to Portfolio Terminal 1.0.0",
    'Type "help" for available commands',
    "",
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.toLowerCase().trim();
    const newHistory = [...history, `$ ${command}`];

    // Execute the command and get the response
    const response = onCommand(command);

    // Add the response to history
    const responseLines = response.split("\n");
    const updatedHistory = [...newHistory, ...responseLines, ""];

    setHistory(updatedHistory);
    setInput("");
  };

  return (
    <div className="bg-black/90 text-green-400 p-4 font-mono text-sm h-full overflow-auto">
      <div className="mb-4">
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <span className="mr-2">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none"
          autoFocus
        />
      </form>
    </div>
  );
}
