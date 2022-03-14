import React from 'react';
// import i18n from '../i18n';
import ReactMarkDown from 'react-markdown';

export function tmd(t, key = '0', translateKey, params = []) {
  const mdString = params.length ? t(translateKey, params) : t(translateKey);
  return <ReactMarkDown source={mdString} key={key} />;
}
