import React, { type FC } from 'react';
import { RCEditor, registerEditor } from '@xmzhou/rc-editor';
import './index.less';

registerEditor();

const Foo: FC = () => {
    return <RCEditor
        className="demo-editor"
    />;
};

export default Foo;
