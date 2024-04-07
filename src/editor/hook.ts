import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { RC_EDITOR, RC_EDITOR_API } from "./props";

export default ({
    options, value, language = 'text', initOptions,
    onInit,
}: RC_EDITOR_API, ref?: React.ForwardedRef<RC_EDITOR>) => {
    const continerRef = useRef<HTMLDivElement>(null);
    const [editor, setEditor] = useState<RC_EDITOR>();
    const handleInit = async () => {
        const container = continerRef.current;
        if (!container) {
            return;
        }
        const _window = window as any;
        const monaco = _window.monaco;
        if (!monaco) {
            return;
        }
        let lastValue = '';
        if (editor) {
            lastValue = editor.getValue();
            editor.dispose();
            setEditor(undefined);
        }
        const newEditor = monaco.editor.create(container, {
            language: language || 'text',
            value: lastValue || value || '',
            ...(initOptions || {})
        });
        setEditor(newEditor);
        if (editor) {
            if (onInit) {
                await onInit(newEditor);
            }
        }
    }

    useEffect(() => {
        handleInit();
        document.addEventListener('onEditorRegistered', handleInit);
        return () => {
            if (editor) {
                editor.dispose();
            }
            document.removeEventListener('onEditorRegistered', handleInit);
        }
    }, [])
    useEffect(() => {
        if (editor && options) {
            editor.updateOptions(options);
        }
    }, [options])
    useEffect(() => {
        if (!editor) {
            return;
        }
        const monaco = (window as any).monaco;
        const oldValue = editor.getValue();
        if ((value || '') !== oldValue && monaco) {
            const position = editor.getPosition() || { lineNumber: 1, column: 1 };
            const row = position?.lineNumber || 1;
            const col = position?.column || 1;
            editor.executeEdits('', [
                {
                    range: new monaco.Range(row, col, row, col),
                    text: value || '',
                    forceMoveMarkers: true,
                }
            ]);
        }
    }, [value])
    useImperativeHandle(ref, () => {
        return editor as any;
    }, [editor]);
    return {
        continerRef,
    };
}