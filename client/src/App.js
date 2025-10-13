import React, { useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Editor } from '@monaco-editor/react';
import { 
  FiPlay, 
  FiTrash2, 
  FiCode, 
  FiTerminal, 
  FiMaximize2, 
  FiMinimize2,
  FiSettings,
  FiFile,
  FiZap
} from 'react-icons/fi';

// Custom layout icons
const LayoutIcon1 = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const LayoutIcon2 = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
    <rect x="9" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const LayoutIcon3 = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="1" y="9" width="14" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const LayoutIcon4 = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="9" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const LayoutIconMove = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
    <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
  </svg>
);

const LayoutIconUp = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="14" height="6" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
    <rect x="1" y="9" width="14" height="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

const LayoutIconLock = ({ className }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="6" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <path d="M5 6V4a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
import './App.css';

function App() {
  const [code, setCode] = useState(`// Welcome to JavaScript Sandbox!
// 
// I built this model to practice programming and learn Object-Oriented Programming concepts
//
// Here you can experiment with JavaScript code,
// study classes, inheritance, polymorphism and other OOP concepts
//
// Example 1: Simple class
//
class User {
  constructor(name, surname) {
    this.name = name;
    this.surname = surname;
  }
  
  getFullName() {
    return this.name + ' ' + this.surname;
  }
  
  introduce() {
    console.log('Hello, my name is ' + this.getFullName());
  }
}

// Create object and call methods
const user = new User('John', 'Doe');
user.introduce();
console.log('Full name:', user.getFullName());

// Example 2: Inheritance
class Student extends User {
  constructor(name, surname, grade) {
    super(name, surname);
    this.grade = grade;
  }
  
  study() {
    console.log(this.getFullName() + ' studies in grade ' + this.grade);
  }
}

const student = new Student('Jane', 'Smith', 10);
student.introduce();
student.study();

// ========================================
// Try modifying the code and run it!
// 
// Ideas for experiments:
// - Add new methods to classes
// - Create new classes with inheritance
// - Try polymorphism (method overriding)
// - Study encapsulation (private properties)
// - Experiment with getters and setters
// ========================================`);

  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [consoleVisible, setConsoleVisible] = useState(true);
  const [consolePosition, setConsolePosition] = useState('right'); // 'right', 'bottom', 'left', 'top'
  const [isConsoleMinimized, setIsConsoleMinimized] = useState(false);
  const [isConsoleLocked, setIsConsoleLocked] = useState(false);
  const [editorRef, setEditorRef] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('dark'); // 'dark', 'light', 'black', 'cyber'
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);


  const handleEditorChange = (value) => setCode(value);

  const cycleConsolePosition = useCallback(() => {
    if (isConsoleLocked) return;
    const positions = ['right', 'bottom', 'left', 'top'];
    const currentIndex = positions.indexOf(consolePosition);
    const nextIndex = (currentIndex + 1) % positions.length;
    setConsolePosition(positions[nextIndex]);
  }, [isConsoleLocked, consolePosition]);

  const moveConsoleUp = () => {
    if (isConsoleLocked) return;
    if (consolePosition === 'top') {
      setConsolePosition('bottom');
    } else {
      setConsolePosition('top');
    }
  };

  const toggleConsoleLock = () => setIsConsoleLocked(prev => !prev);
  const toggleConsoleVisibility = () => setConsoleVisible(prev => !prev);
  const toggleSettings = () => setIsSettingsOpen(prev => !prev);
  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    setIsSettingsOpen(false);
  };

  const handleEditorDidMount = (editor, monaco) => {
    setEditorRef(editor);
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      executeCode();
    });

    // setup autocomplete
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types']
    });

    // add extra types for better autocomplete
    monaco.languages.typescript.javascriptDefaults.addExtraLib(`
      declare var console: {
        log(...args: any[]): void;
        error(...args: any[]): void;
        warn(...args: any[]): void;
        info(...args: any[]): void;
      };
    `, 'console.d.ts');
  };


  const executeCode = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      const response = await axios.post('http://localhost:4444/api/execute', { code });
      
      if (response.data.success) {
        const { output, result } = response.data;
        let displayOutput = output || '';
        
        if (result && result !== 'undefined' && result !== 'Code executed' && !output?.includes(result)) {
          displayOutput += (displayOutput ? '\n--- Result ---\n' : '') + result;
        }
        
        setOutput(displayOutput || 'Code executed successfully');
      } else {
        setError(response.data.error);
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
    setError(null);
  };

  const editorOptions = {
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
    lineNumbers: 'on',
    wordWrap: 'on',
    minimap: { enabled: false },
    automaticLayout: true,
    scrollbar: { vertical: 'auto', horizontal: 'auto' }
  };

  return (
    <div className={`app theme-${currentTheme}`}>
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <button 
            className="logo settings-button"
            onClick={toggleSettings}
            title="Settings"
          >
            <FiZap />
          </button>
          <span className="title">JavaScript Sandbox</span>
        </div>
        <div className="header-right">
          <div className="console-controls">
            <button
              className={`position-button ${consolePosition === 'right' ? 'active' : ''}`}
              onClick={() => !isConsoleLocked && setConsolePosition('right')}
              title="Right Panel Layout"
            >
              <LayoutIcon4 />
            </button>
            <button
              className={`position-button ${consolePosition === 'bottom' ? 'active' : ''}`}
              onClick={() => !isConsoleLocked && setConsolePosition('bottom')}
              title="Bottom Panel Layout"
            >
              <LayoutIcon3 />
            </button>
            <button
              className={`position-button ${isConsoleLocked ? 'active' : ''}`}
              onClick={toggleConsoleLock}
              title={isConsoleLocked ? "Unlock Console" : "Lock Console"}
            >
              <LayoutIconLock />
            </button>
            <button
              className={`position-button ${!consoleVisible ? 'active' : ''}`}
              onClick={toggleConsoleVisibility}
              title={consoleVisible ? "Hide Console" : "Show Console"}
            >
              <LayoutIconUp />
            </button>
          </div>
          <button 
            className="run-button" 
            onClick={executeCode}
            disabled={isLoading}
          >
            {isLoading ? <FiSettings /> : <FiPlay />}
            <span>Run (Ctrl+Enter)</span>
          </button>
        </div>
      </div>

      {/* Settings Menu */}
      {isSettingsOpen && (
        <div className="settings-menu">
          <div className="settings-content">
            <h3>Settings</h3>
            <div className="theme-section">
              <h4>Theme</h4>
              <div className="theme-options">
                <button 
                  className={`theme-option ${currentTheme === 'dark' ? 'active' : ''}`}
                  onClick={() => changeTheme('dark')}
                >
                  <div className="theme-preview dark-theme"></div>
                  <span>Dark</span>
                  {currentTheme === 'dark' && <div className="theme-dot"></div>}
                </button>
                <button 
                  className={`theme-option ${currentTheme === 'light' ? 'active' : ''}`}
                  onClick={() => changeTheme('light')}
                >
                  <div className="theme-preview light-theme"></div>
                  <span>Light</span>
                  {currentTheme === 'light' && <div className="theme-dot"></div>}
                </button>
                <button 
                  className={`theme-option ${currentTheme === 'black' ? 'active' : ''}`}
                  onClick={() => changeTheme('black')}
                >
                  <div className="theme-preview black-theme"></div>
                  <span>Black</span>
                  {currentTheme === 'black' && <div className="theme-dot"></div>}
                </button>
                <button 
                  className={`theme-option ${currentTheme === 'cyber' ? 'active' : ''}`}
                  onClick={() => changeTheme('cyber')}
                >
                  <div className="theme-preview cyber-theme"></div>
                  <span>Cyber City</span>
                  {currentTheme === 'cyber' && <div className="theme-dot"></div>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <PanelGroup direction={consolePosition === 'bottom' || consolePosition === 'top' ? 'vertical' : 'horizontal'}>
          {consolePosition === 'top' && consoleVisible && (
            <>
              <Panel defaultSize={75} minSize={30}>
            <div className="editor-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <FiFile className="panel-icon" />
                  <span>script.js</span>
                </div>
                <div className="panel-controls">
                  {/* Console control buttons moved to console panel */}
                </div>
              </div>
              <div className="editor-container">
                <div className="editor-wrapper">
                      <Editor
                        height="100%"
                        defaultLanguage="javascript"
                    value={code}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        theme={currentTheme === 'light' ? 'vs' : currentTheme === 'cyber' ? 'vs-dark' : 'vs-dark'}
                        options={editorOptions}
                  />
                </div>
              </div>
            </div>
          </Panel>
              {!isConsoleLocked && <PanelResizeHandle className="resize-handle" />}
            </>
          )}

          {/* Console Panel - (Second when console is on top) */}
          {consolePosition === 'top' && consoleVisible && (
            <>
              <Panel defaultSize={25} minSize={15}>
                <div className={`output-panel ${isConsoleLocked ? 'locked' : ''}`}>
                  <div className="panel-header">
                    <div className="panel-title">
                      <FiTerminal className="panel-icon" />
                      <span>Console</span>
                    </div>
                    <div className="panel-controls">
                      <div className="console-actions">
                        <button
                          className="action-button"
                          onClick={clearOutput}
                          title="Clear Console"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          className="action-button"
                          onClick={() => setIsConsoleMinimized(!isConsoleMinimized)}
                          title={isConsoleMinimized ? "Restore Panel" : "Minimize Panel"}
                        >
                          {isConsoleMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {!isConsoleMinimized && (
                    <div className="output-container">
                      {isLoading && (
                        <div className="loading">
                          <FiSettings />
                          <span>Executing code...</span>
                        </div>
                      )}
                      {error && (
                        <div className="error">
                          <span>Error: {error}</span>
                        </div>
                      )}
                      {output && (
                        <div className="output">
                          <pre>{output}</pre>
                        </div>
                      )}
                      {!isLoading && !error && !output && (
                        <div className="placeholder">
                          <span>Press Ctrl+Enter or click "Run" to execute code</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Panel>
            </>
          )}

          {/* Editor Panel - Default position */}
          {consolePosition !== 'top' && (
            <Panel defaultSize={70} minSize={30}>
              <div className="editor-panel">
                <div className="panel-header">
                  <div className="panel-title">
                    <FiFile className="panel-icon" />
                    <span>script.js</span>
                  </div>
                  <div className="panel-controls">
                    {/* Console control buttons moved to console panel */}
                  </div>
                </div>
                <div className="editor-container">
                  <div className="editor-wrapper">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      value={code}
                      onChange={handleEditorChange}
                      onMount={handleEditorDidMount}
                      theme="vs-dark"
                      options={editorOptions}
                    />
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {/* Console Panel - Right/Bottom */}
          {(consolePosition === 'right' || consolePosition === 'bottom') && consoleVisible && (
            <>
              {!isConsoleLocked && <PanelResizeHandle className="resize-handle" />}
              <Panel defaultSize={30} minSize={20}>
                <div className="output-panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      <FiTerminal className="panel-icon" />
                      <span>Console</span>
                    </div>
                    <div className="panel-controls">
                      <div className="console-actions">
                        <button
                          className="action-button"
                          onClick={clearOutput}
                          title="Clear Console"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          className="action-button"
                          onClick={() => setIsConsoleMinimized(!isConsoleMinimized)}
                          title={isConsoleMinimized ? "Restore Panel" : "Minimize Panel"}
                        >
                          {isConsoleMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {!isConsoleMinimized && (
                    <div className="output-container">
                      {isLoading && (
                        <div className="loading">
                          <FiSettings />
                          <span>Executing code...</span>
                        </div>
                      )}
                      {error && (
                        <div className="error">
                          <span>Error: {error}</span>
                        </div>
                      )}
                      {output && (
                        <div className="output">
                          <pre>{output}</pre>
                        </div>
                      )}
                      {!isLoading && !error && !output && (
                        <div className="placeholder">
                          <span>Press Ctrl+Enter or click "Run" to execute code</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Panel>
            </>
          )}

          {/* Console Panel - Left */}
          {consolePosition === 'left' && consoleVisible && (
            <>
              <Panel defaultSize={30} minSize={20}>
                <div className="output-panel">
                  <div className="panel-header">
                    <div className="panel-title">
                      <FiTerminal className="panel-icon" />
                      <span>Console</span>
                    </div>
                    <div className="panel-controls">
                      <div className="console-actions">
                        <button
                          className="action-button"
                          onClick={clearOutput}
                          title="Clear Console"
                        >
                          <FiTrash2 />
                        </button>
                        <button
                          className="action-button"
                          onClick={() => setIsConsoleMinimized(!isConsoleMinimized)}
                          title={isConsoleMinimized ? "Restore Panel" : "Minimize Panel"}
                        >
                          {isConsoleMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {!isConsoleMinimized && (
                    <div className="output-container">
                      {isLoading && (
                        <div className="loading">
                          <FiSettings />
                          <span>Executing code...</span>
                        </div>
                      )}
                      {error && (
                        <div className="error">
                          <span>Error: {error}</span>
                        </div>
                      )}
                      {output && (
                        <div className="output">
                          <pre>{output}</pre>
                        </div>
                      )}
                      {!isLoading && !error && !output && (
                        <div className="placeholder">
                          <span>Press Ctrl+Enter or click "Run" to execute code</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Panel>
              {!isConsoleLocked && <PanelResizeHandle className="resize-handle" />}
            </>
          )}
        </PanelGroup>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span>
            <FiCode className="status-icon" />
            JavaScript
          </span>
          <span>UTF-8</span>
        </div>
        <div className="status-right">
          <span>
            {isLoading ? 'Executing...' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
