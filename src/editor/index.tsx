import React, { forwardRef, type FC } from 'react';
import { RC_EDITOR, RC_EDITOR_API } from './props';
import classNames from 'classnames';
import useData from './hook';

const Index = forwardRef<RC_EDITOR, Omit<RC_EDITOR_API, 'ref'>>((props, ref) => {
    const {
      continerRef,
    } = useData(props, ref);
    return (
      <div className={classNames('tant-monaco-editor', props.className)} ref={continerRef} />
    );
  });

export default Index;
