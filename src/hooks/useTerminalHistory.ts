import { useState } from "react";

/**
 * Custom hook for managing terminal history
 * @param initialHistory Initial history lines
 * @returns Terminal history state and methods
 */
export function useTerminalHistory(initialHistory: string[] = []) {
  const [history, setHistory] = useState<string[]>([
    "Welcome to Portfolio Terminal 1.0.0",
    'Type "help" for available commands',
    "",
    ...initialHistory,
  ]);
  const [input, setInput] = useState("");

  /**
   * Add a command and its response to the history
   * @param command Command string
   * @param response Response string
   */
  const addToHistory = (command: string, response: string) => {
    const newHistory = [...history, `$ ${command}`];
    const responseLines = response.split("\n");
    const updatedHistory = [...newHistory, ...responseLines, ""];
    setHistory(updatedHistory);
  };

  /**
   * Clear the terminal history
   */
  const clearHistory = () => {
    setHistory([]);
  };

  /**
   * Reset the terminal history to initial state
   */
  const resetHistory = () => {
    setHistory([
      "Welcome to Portfolio Terminal 1.0.0",
      'Type "help" for available commands',
      "",
    ]);
  };

  return {
    history,
    input,
    setInput,
    addToHistory,
    clearHistory,
    resetHistory,
  };
}
