import { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { XMarkIcon, MinusIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
  children: React.ReactNode;
}

export default function Window({
  title,
  isOpen,
  onClose,
  onMinimize,
  onMaximize,
  isMaximized,
  children
}: WindowProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const previousSize = useRef({ width: 600, height: 400 });
  const previousPosition = useRef({ x: 100, y: 100 });

  useEffect(() => {
    if (isOpen && !isClosing) {
      setIsVisible(true);
      setIsClosing(false);
      setIsMinimizing(false);
    }
  }, [isOpen, isClosing]);

  useEffect(() => {
    if (isMaximized) {
      previousSize.current = size;
      previousPosition.current = position;
    }
  }, [isMaximized]);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before hiding the window
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setIsVisible(false);
    }, 400); // Match this with CSS animation duration
  };

  const handleMinimize = () => {
    setIsMinimizing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsMinimizing(false);
      onMinimize();
    }, 400);
  };

  const handleMaximize = () => {
    if (!isMaximized) {
      previousSize.current = size;
      previousPosition.current = position;
    }
    onMaximize();
  };

  if (!isOpen && !isClosing && !isVisible) return null;

  return (
    <Rnd
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        transition: "width 0.3s, height 0.3s, transform 0.3s",
      }}
      size={isMaximized ? { width: '100%', height: '100%' } : size}
      position={isMaximized ? { x: 0, y: 0 } : position}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResize={(e, direction, ref, delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
        setPosition(position);
      }}
      dragHandleClassName="window-handle"
      disableDragging={isMaximized}
      enableResizing={!isMaximized}
    >
      <div
        ref={windowRef}
        className={clsx(
          "flex flex-col bg-mac-window backdrop-blur-lg rounded-lg shadow-lg window-transition",
          "border border-mac-border w-full h-full overflow-hidden",
          isClosing ? "genie-exit" : "genie-enter",
          isMinimizing && "window-minimized",
          isMaximized && "window-maximized"
        )}
      >
        <div className="window-handle flex items-center p-2 bg-gray-100 border-b border-mac-border">
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            />
            <button
              onClick={handleMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            />
          </div>
          <span className="flex-1 text-center text-sm font-medium text-gray-700">{title}</span>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </Rnd>
  );
}