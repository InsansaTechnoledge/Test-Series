import React, { useEffect, useRef, useState } from 'react';

const CodeEditor = ({ code, onChange, language }) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [theme , setTheme] = useState('vs-dark')

  useEffect(() => {
    if (window.monaco) {
      initializeEditor();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs/loader.min.js';
      script.onload = () => {
        window.require.config({
          paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }
        });
        window.require(['vs/editor/editor.main'], () => {
          initializeEditor();
        });
      };
      document.head.appendChild(script);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  const initializeEditor = () => {
    if (containerRef.current && !editorRef.current) {
      const monacoEditor = window.monaco.editor.create(containerRef.current, {
        value: code || '',
        language: mapLanguage(language),
        theme, 
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        wordWrap: 'on',
        scrollBeyondLastLine: false
      });

      editorRef.current = monacoEditor;
      setIsEditorReady(true);

      monacoEditor.onDidChangeModelContent(() => {
        onChange(monacoEditor.getValue());
      });
    }
  };

  // Map language to Monaco's language ID
  const mapLanguage = (lang) => {
    const map = { cpp: 'cpp', java: 'java', python: 'python', javascript: 'javascript' };
    return map[lang] || 'plaintext';
  };

  // Update language if changed
  useEffect(() => {
    if (editorRef.current && isEditorReady) {
      const monacoLanguage = mapLanguage(language);
      window.monaco.editor.setModelLanguage(editorRef.current.getModel(), monacoLanguage);
    }
  }, [language, isEditorReady]);

  // Update code if changed externally
  useEffect(() => {
    if (editorRef.current && isEditorReady && editorRef.current.getValue() !== code) {
      editorRef.current.setValue(code);
    }
  }, [code, isEditorReady]);

  return <div ref={containerRef} className="h-full border rounded" />;
};

export default CodeEditor;
