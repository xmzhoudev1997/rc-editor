## 安装
``` shell
npm install @xmzhou/rc-editor
```

## 说明
* 组件是通过script标签的方式引入monaco-editor，这种方式不仅可以减少包体积，而且可以实现组件的国际化。因此需要设置`sourceUrl`指定资源所在路径，默认使用npm源`https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs`;
* 组件支持国际化，目前支持`zh-CN`、`en-US`、`ja-JP`、`ko-KR`，如需更多请联系作者

## 示例
<code src="@/demo/index.tsx"></code>

## API
``` typescript
export type MONACO_EDITOR_LOCALE = 'zh-CN' | 'ja-JP' | 'ko-KR' | 'en-US';
export type MONACO_EDITOR_LANGUAGE = 'bap' | 'go' | 'objective-c' | 'rust' | 'apex' | 'graphql' | 'pascal' | 'sb' | 'azcli' | 'handlebars' | 'pascaligo' | 'scala' | 'bat' | 'hcl' | 'perl' | 'scheme' | 'bicep' | 'html' | 'pgsql' | 'scss' | 'cameligo' | 'ini' | 'php' | 'shell' | 'clojure' | 'java' | 'pla' | 'solidity' | 'coffee' | 'javascript' | 'postiats' | 'sophia' | 'cpp' | 'julia' | 'powerquery' | 'sparql' | 'csharp' | 'kotlin' | 'powershell' | 'sql' | 'csp' | 'less' | 'protobuf' | 'st' | 'css' | 'lexon' | 'pug' | 'swift' | 'cypher' | 'liquid' | 'python' | 'systemverilog' | 'dart' | 'lua' | 'qsharp' | 'tcl' | 'dockerfile' | 'm3' | 'r' | 'twig' | 'ecl' | 'markdown' | 'razor' | 'typescript' | 'elixir' | 'mdx' | 'redis' | 'vb' | 'flow9' | 'mips' | 'redshift' | 'wgsl' | 'freemarker2' | 'msdax' | 'restructuredtext' | 'xml' | 'fsharp' | 'mysql' | 'ruby' | 'yaml' | 'text';
export type RC_EDITOR = monaco.editor.IStandaloneCodeEditor;

export interface RC_EDITOR_API {
    /**
     * 自定义样式
     */
    className?: string;
    /**
     * 文本内容
     */
    value?: string;
    /**
     * 编辑器语种，对所有实例生效
     */
    locale?: MONACO_EDITOR_LOCALE;
    /**
     * 编辑器支持语言
     */
    language?: MONACO_EDITOR_LANGUAGE;
    /**
     * 初始化配置
     */
    initOptions?: Omit<Omit<monaco.editor.IStandaloneEditorConstructionOptions, 'language'>, 'value'>;
    /**
     * 更新配置
     */
    options?: monaco.editor.IEditorOptions;
    /**
     * ref对象，返回editor实例化对象
     */
    ref?: RC_EDITOR;
    /**
     * monaco editor loader.js所在目录的在线资源，不设置无法解决国际化问题
     */
    sourceUrl?: string;
    /**
     * 编辑器初始化后调用，`locale`和`sourceUrl`变动时也会触发
     * @returns 
     */
    onInit?: (
        editor: RC_EDITOR,
    ) => Promise<void>;
}
```