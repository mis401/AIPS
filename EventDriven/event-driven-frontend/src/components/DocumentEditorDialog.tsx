import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import '../styles/DocumentEditorDialog.css';
import textFileIcon from '../assets/images/text-file.png';
import todoListIcon from '../assets/images/todo-list.png';
import whiteboardIcon from '../assets/images/whiteboard.png';
import undoIcon from '../assets/images/undo.png';
import { DocumentType } from '../dtos/NewDocument';
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';
import { DiffDTO } from '../dtos/diff.dto';
import { SocketDiffDTO } from '../dtos/socket-diff.dto';

interface DocumentEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (diffDto: DiffDTO) => void;
  docId?: number;
  content?: string;
  type?: DocumentType;
}

const socket = io('http://localhost:8000', {autoConnect: false});

const DocumentEditorDialog: React.FC<DocumentEditorDialogProps> = ({
  open,
  onClose,
  onSave,
  docId,
  content = '',
  type = DocumentType.DOCUMENT,
}) => {
  const [currentContent, setCurrentContent] = useState(content);
  const [docType, setDocType] = useState<DocumentType>(type);
  const [todoItems, setTodoItems] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [lineWidth, setLineWidth] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const historyRef = useRef<ImageData[]>([]);
  const { auth } = useAuth();
  const userInState = auth?.user;


  useEffect(() => {
    
    console.log(socket.connected)
    console.log(docId)
    if(socket.connected || !docId)
      return;
    socket.connect();
    socket.emit(`register`, docId)
    socket.on(`document_changed ${docId}`, (data: SocketDiffDTO) => {
      if (data.id === docId) {
        if (docType == DocumentType.DOCUMENT || docType == DocumentType.TODO){
          console.log(currentContent + data.diff)
          setCurrentContent(currentContent.concat(data.diff!));
        }
        else if (docType == DocumentType.WHITEBOARD){
          const canvas = canvasRef.current;
          if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.lineTo(data.mouseData!.x - rect.left, data.mouseData!.y - rect.top);
              ctx.stroke();
            }
          }
        }
      }
    });
  });

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const oldContent = currentContent;
    const newContent = e.target.value;
    const diff = newContent.replace(oldContent, '');
    console.log(newContent);
    console.log(diff);
    socket.emit(`document_change`, { id: docId, diff: diff, mouseData: null, type: docType });
    setCurrentContent(newContent);
  };

  const handleSave = () => {
    const formattedContent = docType === DocumentType.TODO ? todoItems.join('\n') : currentContent;
    const diffDto: DiffDTO = {
      path: '', 
      type: docType,
      content: formattedContent,
      id: docId || 0,
      user: userInState?.id || 0,
    };
    onSave(diffDto); 
    onClose();
  };

  useEffect(() => {
    setCurrentContent(content);
    setDocType(type);
    if (type === DocumentType.TODO) {
      setTodoItems(content.split('\n'));
    } else {
      setTodoItems([]);
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (!currentContent) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          const img = new Image();
          img.src = currentContent;
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
        }
      }
    }
  }, [docType, content, currentContent]);

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
      setCurrentContent(todoItems.join('\n'));
    } else if (type === DocumentType.TODO) {
      setTodoItems(currentContent.split('\n'));
    }
    setDocType(type);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (historyRef.current.length > 50) {
          historyRef.current.shift();
        }
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
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
        //ctx.closePath();
        setIsDrawing(false);
        const dataURL = canvas.toDataURL();
        setCurrentContent(dataURL);
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

  const handleClose = () => {
    socket.emit(`unregister`, {docId});
    socket.disconnect();
    onClose();
  }

  if (!open) {
    //socket.emit(`unregister`, docId);
    return null;
  }
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
              value={currentContent}
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
          <button onClick={handleClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditorDialog;
