import { useEffect, useImperativeHandle, useRef } from "react";
import { RC_EDITOR, RC_EDITOR_API } from "./props";

const initLoader = (sourceUrl: string) => new Promise((resolve) => {
    let script: HTMLScriptElement | null = document.head.querySelector('#monaco-editor-loader');
    if (!script) {
        console.log(1);
        script = document.createElement('script');
        script.id = 'monaco-editor-loader';
        document.head.appendChild(script);
        script.type = 'text/javascript';
        script.src = `${sourceUrl}${sourceUrl.endsWith('/') ? '' : '/'}loader.js`;
        script.onload = () => {
            resolve(0);
        }
        return;
    }
    resolve(0);
});
const clearLoader = () => {
    let script: HTMLScriptElement | null = document.head.querySelector('#monaco-editor-loader');
    if (script) {
        script.remove();
    }
}

const LOCALE_MAP = {
    'zh-CN': 'zh-cn',
    'ko-KR': 'ko',
    'en-US': 'es',
    'ja-JP': 'ja',
  }

export default ({
    sourceUrl = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs',
    locale = 'zh-CN', options, value, language = 'text', initOptions,
    onInit,
}: RC_EDITOR_API, ref?: React.ForwardedRef<RC_EDITOR>) => {
    const continerRef = useRef<HTMLDivElement>(null);
    const cacheRef = useRef<RC_EDITOR>();
    const handleInit = async () => {
        const container = continerRef.current;
        if (!container) {
            return;
        }
        await initLoader(sourceUrl);
        const _window = window as any;
        const editorRequire = _window.require;
        if (editorRequire.getConfig()?.['vs/nls']?.availableLanguages?.['*'] !== locale) {
            editorRequire.reset();
            editorRequire.locale = locale;
            editorRequire.config({
                paths: {
                    vs: sourceUrl,
                },
                "vs/nls": {
                    availableLanguages: {
                        "*": LOCALE_MAP[locale],
                    }
                },
            });
        }
        _window.monaco = await new Promise((resolve, reject) => {
            editorRequire(
                ['vs/editor/editor.main'],
                function (monaco: any) {
                    resolve(monaco);
                },
                function () {
                    reject(null);
                },
            );
        })
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
        clearLoader();
        handleInit();
    }, [locale, sourceUrl])
    useEffect(() => {
        return () => {
            if (cacheRef.current) {
                cacheRef.current.dispose();
            }
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