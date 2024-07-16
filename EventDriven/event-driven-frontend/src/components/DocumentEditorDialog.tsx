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
import { PermDeviceInformation } from '@mui/icons-material';
import { DrawingPhaseDTO } from '../dtos/drawing-phase.dto';
import { LineCfgDTO } from '../dtos/linecfg.dto';

interface DocumentEditorDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (diffDto: DiffDTO) => void;
  docId?: number;
  content?: string;
  type?: DocumentType;
  ownerProp?: boolean
}

const socket = io('http://localhost:8000', {autoConnect: false});

const DocumentEditorDialog: React.FC<DocumentEditorDialogProps> = ({
  open,
  onClose,
  onSave,
  docId,
  ownerProp,
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
  const [owner, setOwner] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const historyRef = useRef<ImageData[]>([]);
  const { auth } = useAuth();
  const userInState = auth?.user;

  useEffect(() => {
    console.log(docId);
    if (docId) {
      socket.connect();
      socket.emit('register', docId);
      if (!socket.hasListeners(`document_changed ${docId}`)) {
        socket.on("ownership", (data: boolean) => {
          console.log("Ownership call")
          setOwner(data);
        })
        socket.on(`linecfg-update`, (data: LineCfgDTO) => {
          //console.log(data);
          setColor(color => data.color);
          setLineWidth(lw => data.lineWidth);
          //console.log(color, lineWidth);
        });
        socket.on(`drawing_started`, (data: DrawingPhaseDTO) => {
          const canvas = canvasRef.current;
              if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.closePath();
                  console.log("draw start")
                  //console.log(color, lineWidth)
                  ctx.strokeStyle=data.color;
                  ctx.lineWidth=data.lineWidth;
                  ctx.moveTo(data.x, data.y);
                  ctx.beginPath();
                }
              }
        });
        socket.on(`document_changed ${docId}`, (data: SocketDiffDTO) => {
          if (data.id === docId) {
            if (docType === DocumentType.DOCUMENT || docType === DocumentType.TODO) {
              console.log(data);
              if (data.diff == null && data.index != null) {
                setCurrentContent(prevContent => {
                  const firstSlice = prevContent.slice(0, data.index) ? prevContent.slice(0, data.index) : '';
                  const secondSlice = prevContent.slice(data.index+1) ? prevContent.slice(data.index+1) : '';
                  console.log(firstSlice);
                  console.log(secondSlice);
                  if(firstSlice+secondSlice)
                    return firstSlice+secondSlice;
                  else
                    return ''})
              }
              else if(data.diff != null && data.index != null){
                setCurrentContent(prevContent => {
                  const array = prevContent.split('');
                  console.log(array);
                  const spliced = array.splice(data.index, 1, data.diff!);
                  console.log(spliced);
                  const joined = array.join('');
                  console.log(joined);
                  return joined;
                });
              }
              else {
                setCurrentContent(prevContent => prevContent + data.diff);
              }
            } else if (docType === DocumentType.WHITEBOARD) {
              const canvas = canvasRef.current;
              if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.lineTo(data.mouseData!.x, data.mouseData!.y);
                  console.log("Drawing to: ", data.mouseData!.x, data.mouseData!.y)
                  ctx.stroke();
                  
                }
              }
            }
          }
        });
        console.log("Listeners attached, socket connected? ", socket.connected, socket.listeners);
      }
    }

    return () => {
      if (docId) {
        socket.emit('unregister', docId);
        socket.offAny();
        socket.disconnect();
      }
    };
  }, [docId, docType]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const oldContent = currentContent;
    const newContent = e.target.value;
    const caretPosition = textareaRef.current?.selectionEnd;
    let diff: string = ''
    if (newContent.length < oldContent.length){
      socket.emit(`document_change`, { id: docId, diff: null, index: caretPosition!, mouseData: null, type: docType });
    }
    else if (newContent.length === oldContent.length){
      diff = newContent[caretPosition!-1];
      socket.emit(`document_change`, { id: docId, diff: diff, index: caretPosition!-1, mouseData: null, type: docType });
    }
    else {
      diff = newContent[caretPosition!-1];
      socket.emit(`document_change`, { id: docId, diff: diff, index: caretPosition!-1, mouseData: null, type: docType });
    }
    
    console.log(newContent);
    console.log(diff);
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
  }, [docId]);


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

  useEffect(() => {
    socket.emit(`linecfg`, {id: docId, color, lineWidth})
  }, [docId, color, lineWidth])

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
    if (docType === DocumentType.WHITEBOARD)
      return;
    if ((docType === DocumentType.DOCUMENT || docType === DocumentType.TODO) && type === DocumentType.WHITEBOARD)
      return;
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
        socket.emit(`drawing_start`, {id: docId, x:e.clientX - rect.left, y:e.clientY - rect.top, color, lineWidth});
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
        socket.emit(`document_change`, {id: docId, diff: null, mouseData: {x:e.clientX - rect.left, y: e.clientY - rect.top}, type: docType})
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
    socket.emit(`unregister`, docId);
    socket.disconnect();
    socket.offAny();
    console.log(docId);
    docId=0;
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
              disabled={!owner && !ownerProp}
              value={currentContent}
              ref={textareaRef}
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
                    disabled={!owner && !ownerProp}
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
                contentEditable={owner || ownerProp}
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
