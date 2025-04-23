import React, { useRef, useEffect } from "react";
import { useTerminalHistory } from "../../hooks/useTerminalHistory";

/**
 * Terminal component props interface
 */
interface TerminalProps {
  onCommand: (command: string) => string;
}

/**
 * Terminal component for command-line interface
 */
export default function Terminal({ onCommand }: TerminalProps) {
  // Use the terminal history hook
  const { history, input, setInput, addToHistory } = useTerminalHistory();

  // Reference to the terminal container for auto-scrolling
  const terminalRef = useRef<HTMLDivElement>(null);
  // Reference to the input field for auto-focus
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle command submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.toLowerCase().trim();

    if (!command) return;

    // Execute the command and get the response
    const response = onCommand(command);

    // Add the command and response to history
    addToHistory(command, response);
    setInput("");
  };

  /**
   * Auto-scroll to the bottom when history changes
   */
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  /**
   * Auto-focus the input field when the component mounts
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={terminalRef}
      className="bg-black/90 text-green-400 p-4 font-mono text-sm h-full overflow-auto"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-4">
        {history.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
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
