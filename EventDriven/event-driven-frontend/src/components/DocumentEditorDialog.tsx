import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import '../styles/DocumentEditorDialog.css';
import textFileIcon from '../assets/images/text-file.png';
import todoListIcon from '../assets/images/todo-list.png';
import whiteboardIcon from '../assets/images/whiteboard.png';
import undoIcon from '../assets/images/undo.png'; // Import the undo button image
import { DocumentType } from '../dtos/NewDocument';

interface DocumentEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (content: string, type: DocumentType) => void;
}

const DocumentEditorDialog: React.FC<DocumentEditorDialogProps> = ({ open, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [docType, setDocType] = useState<DocumentType>(DocumentType.DOCUMENT);
  const [todoItems, setTodoItems] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lineWidth, setLineWidth] = useState(2); // Default line width
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<ImageData[]>([]);

  useEffect(() => {
    if (!open) {
      setContent('');
      setTodoItems([]);
      historyRef.current = [];
    }
  }, [open]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [docType]);

  const handleSave = () => {
    const formattedContent = docType === DocumentType.TODO ? todoItems.join('\n') : content;
    onSave(formattedContent, docType);
    onClose();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleTodoContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTodoItems(e.target.value.split('\n'));
  };

  const handleAddTodoItem = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTodoItems = [...todoItems];
      newTodoItems.splice(index + 1, 0, '');
      setTodoItems(newTodoItems);
    }
  };

  const handleTodoItemChange = (index: number, value: string) => {
    const newTodoItems = [...todoItems];
    newTodoItems[index] = value;
    setTodoItems(newTodoItems);
  };

  const handleDocTypeChange = (type: DocumentType) => {
    if (docType === DocumentType.TODO && type !== DocumentType.TODO) {
      setContent(todoItems.join('\n'));
    } else if (type === DocumentType.TODO) {
      setTodoItems(content.split('\n'));
    }
    setDocType(type);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Save current state to history before starting a new drawing action
        historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (historyRef.current.length > 50) { // Limit history size
          historyRef.current.shift();
        }
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth; // Set the line width here
        setIsDrawing(true);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.closePath();
        setIsDrawing(false);
      }
    }
  };

  const handleColorChange = (color: any) => {
    setColor(color.hex);
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleLineWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLineWidth(Number(e.target.value));
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx && historyRef.current.length > 0) {
        const lastState = historyRef.current.pop();
        if (lastState) {
          ctx.putImageData(lastState, 0, 0);
        }
      }
    }
  };

  if (!open) return null;

  return (
    <div className="document-editor-dialog">
      <div className="dialog-content">
        <div className="dialog-header">
          <button
            onClick={() => handleDocTypeChange(DocumentType.DOCUMENT)}
            className={docType === DocumentType.DOCUMENT ? 'selected' : ''}
            title="Text File"
          >
            <img src={textFileIcon} alt="Text File" />
          </button>
          <button
            onClick={() => handleDocTypeChange(DocumentType.TODO)}
            className={docType === DocumentType.TODO ? 'selected' : ''}
            title="To-Do List"
          >
            <img src={todoListIcon} alt="To-Do List" />
          </button>
          <button
            onClick={() => handleDocTypeChange(DocumentType.WHITEBOARD)}
            className={docType === DocumentType.WHITEBOARD ? 'selected' : ''}
            title="Whiteboard"
          >
            <img src={whiteboardIcon} alt="Whiteboard" />
          </button>
        </div>
        <div className="dialog-body">
          {docType === DocumentType.DOCUMENT && (
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Type your text here..."
            />
          )}
          {docType === DocumentType.TODO && (
            <div className="todo-list">
              {todoItems.map((item, index) => (
                <div key={index} className="todo-item">
                  <input
                    type="checkbox"
                    className="todo-checkbox"
                  />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleTodoItemChange(index, e.target.value)}
                    onKeyPress={(e) => handleAddTodoItem(e, index)}
                    className="todo-text"
                  />
                </div>
              ))}
            </div>
          )}
          {docType === DocumentType.WHITEBOARD && (
            <div className="whiteboard-container">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="whiteboard-canvas"
              ></canvas>
              <div className="whiteboard-controls">
                <div className="color-picker">
                  <button onClick={toggleColorPicker} style={{ backgroundColor: color }} className="color-button">
                    {showColorPicker && (
                      <SketchPicker
                        color={color}
                        onChangeComplete={handleColorChange}
                        disableAlpha
                      />
                    )}
                  </button>
                </div>
                <div className="line-width-slider">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={lineWidth}
                    onChange={handleLineWidthChange}
                  />
                </div>
                <button onClick={handleUndo} className={`undo-button ${historyRef.current.length === 0 ? 'inactive' : ''}`}>
                  <img src={undoIcon} alt="Undo" />
                </button> 
              </div>
            </div>
          )}
        </div>
        <div className="dialog-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorDialog;
