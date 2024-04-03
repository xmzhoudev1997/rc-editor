const LOCALE_MAP = {
    'zh-CN': 'zh-cn',
    'ko-KR': 'ko',
    'en-US': 'es',
    'ja-JP': 'ja',
}

export default async (
    locale: keyof typeof LOCALE_MAP = 'zh-CN',
    url: string = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs'
) => {
    const _window = window as any;
    const editorRequire: any = await new Promise(resolve => {
        let script: HTMLScriptElement | null = document.head.querySelector('#monaco-editor-loader');
        if (!script) {
            script = document.createElement('script');
            script.id = 'monaco-editor-loader';
            document.head.appendChild(script);
            script.type = 'text/javascript';
            script.src = `${url}${url.endsWith('/') ? '' : '/'}loader.js`;
            script.onload = () => {
                resolve(_window.require);
            }
            return;
        }
        resolve(_window.require);
    });
    if (!editorRequire) {
        return;
    }
    if (editorRequire.getConfig()?.['vs/nls']?.availableLanguages?.['*'] !== locale) {
        editorRequire.reset();
        editorRequire.locale = locale;
        editorRequire.config({
            paths: {
                vs: url,
            },
            "vs/nls": {
                availableLanguages: {
                    "*": LOCALE_MAP[locale],
                }
            },
        });
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
    } else if (!_window.monaco) {
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
    }
    const event = new CustomEvent('onEditorRegistered', {});
    document.dispatchEvent(event);
}