export interface Window {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  component: React.ComponentType;
  x: number; // Add this
  y: number; // Add this
  lastActive: number;
}
