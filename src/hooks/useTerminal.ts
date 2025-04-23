/**
 * Custom hook for handling terminal commands
 * @param openWindow Function to open a window by ID
 * @returns Function to process terminal commands
 */
export function useTerminal(openWindow: (id: string) => void) {
  /**
   * Processes terminal commands and returns appropriate responses
   * @param command Command string to process
   * @returns Response string for the terminal
   */
  const processCommand = (command: string): string => {
    switch (command) {
      case "whoami":
        return "A passionate developer who loves creating beautiful interfaces";
      case "ls projects":
        return "Project 1\nProject 2\nProject 3";
      case "open contact":
        openWindow("contact");
        return "Opening contact...";
      case "help":
        return "Available commands:\nwhoami - About me\nls projects - List projects\nopen contact - Open contact window";
      default:
        return `Command not found: ${command}`;
    }
  };

  return { processCommand };
}
