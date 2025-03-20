export interface Window {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  component: React.ComponentType;
}
