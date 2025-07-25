import React, { useEffect, useRef, useState } from 'react';

const CodeEditor = ({ code, onChange, language, theme, question_id, contest_id }) => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

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

  useEffect(() => {
    const model = editorRef.current?.getModel();
    if (model && language) {
      monaco.editor.setModelLanguage(model, language);
    }
  }, [language]);

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current && isEditorReady && theme) {
      window.monaco.editor.setTheme(theme);
    }
  }, [theme, isEditorReady]);

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
        scrollBeyondLastLine: false,
        roundedSelection: false,
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          useShadows: false,
          verticalHasArrows: true,
          horizontalHasArrows: true,
        },
        overviewRulerLanes: 2,
        cursorBlinking: 'blink',
        cursorStyle: 'line',
        cursorWidth: 2,
        tabSize: 2,
        insertSpaces: true,
        detectIndentation: true,
        renderLineHighlight: 'all',
        selectionHighlight: true,
        occurrencesHighlight: true,
        codeLens: false,
        folding: true,
        foldingHighlight: true,
        showFoldingControls: 'mouseover',
        matchBrackets: 'always',
        contextmenu: true,
        mouseWheelZoom: true,
        quickSuggestions: {
          other: true,
          comments: true,
          strings: true
        },
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: 'on',
        acceptSuggestionOnCommitCharacter: true,
        snippetSuggestions: 'top',
        emptySelectionClipboard: false,
        copyWithSyntaxHighlighting: true,
        wordBasedSuggestions: true,
        suggestSelection: 'first',
        suggestFontSize: 0,
        suggestLineHeight: 0,
        tabCompletion: 'off',
        suggest: {
          filterGraceful: true,
          snippets: 'top'
        }
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
    const map = {
      cpp: 'cpp',
      java: 'java',
      python: 'python',
      python3: 'python',
      javascript: 'javascript',
      typescript: 'typescript',
      c: 'c',

    };
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
      editorRef.current.setValue(localStorage.getItem(`contest_${contest_id}_problem_${question_id}_language_${language}_code_`) || code);
    }
  }, [code, isEditorReady]);

  return <div
    ref={containerRef}
    className="border rounded"
    style={{ width: "100%", height: "99%" }}
  />;
};

export default CodeEditor;