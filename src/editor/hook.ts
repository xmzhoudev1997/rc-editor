import { useEffect, useImperativeHandle, useRef } from "react";
import { RC_EDITOR, RC_EDITOR_API } from "./props";

export default ({
    options, value, language = 'text', initOptions,
    onInit,
}: RC_EDITOR_API, ref?: React.ForwardedRef<RC_EDITOR>) => {
    const continerRef = useRef<HTMLDivElement>(null);
    const cacheRef = useRef<RC_EDITOR>();
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
        let editor = cacheRef.current;
        let lastValue = '';
        if (editor) {
            lastValue = editor.getValue();
            editor.dispose();
            cacheRef.current = undefined;
            editor = undefined;
        }
        cacheRef.current = monaco.editor.create(container, {
            language: language || 'text',
            value: lastValue || value || '',
            ...(initOptions || {})
        });
        editor = cacheRef.current;
        if (editor) {
            if (onInit) {
                await onInit(editor);
            }
        }
    }

    useEffect(() => {
        handleInit();
        document.addEventListener('onEditorRegistered', handleInit);
        return () => {
            if (cacheRef.current) {
                cacheRef.current.dispose();
            }
            document.removeEventListener('onEditorRegistered', handleInit);
        }
    }, [])
    useEffect(() => {
        const editor = cacheRef.current;
        if (editor && options) {
            editor.updateOptions(options);
        }
    }, [options])
    useEffect(() => {
        const editor = cacheRef.current;
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
        return cacheRef.current as any;
    }, [cacheRef.current]);
    return {
        continerRef,
    };
}