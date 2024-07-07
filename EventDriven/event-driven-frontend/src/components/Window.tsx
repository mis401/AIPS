import React, { ReactNode } from 'react';
import '../styles/Window.css';

interface WindowProps {
  onClose: () => void;
  children: ReactNode;
  top: number;
}

const Window: React.FC<WindowProps> = ({ onClose, children, top }) => {
  return (
    <div className="window" style={{ top: `${top}px`}}>
      <div className="window-header">
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <div className="window-content">{children}</div>
    </div>
  );
};

export default Window;