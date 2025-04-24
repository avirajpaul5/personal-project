export interface Window {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  component: React.ComponentType;
  x: number;
  y: number;
  lastActive: number;
  showInDock?: boolean; // Optional property to control visibility in dock
}
