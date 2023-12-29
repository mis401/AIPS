import React, { ReactNode } from 'react';
import '../styles/Window.css';

interface WindowProps {
  onClose: () => void;
  children: ReactNode;
}

const Window: React.FC<WindowProps> = ({ onClose, children }) => {
  return (
    <div className="window">
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
