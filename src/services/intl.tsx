import React from 'react';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { MessagesType, TranslationId } from './types';
import { isBrowser, isServer } from '../components/helpers';
import { getServerIntl } from './intlServer';
import { publishDbgObject } from '../utils';
import { fetchSchemaTranslations } from './tagging/translations'; // eslint-disable-line import/no-cycle

type Values = { [variable: string]: string | number };

interface Intl {
  lang: string;
  messages: MessagesType | {};
}

export const intl: Intl = {
  lang: '',
  messages: {},
};

const VARIABLE_REGEX = /__(?<name>[a-zA-Z_]+)__/g;

const replaceValues = (text: string, values: Values) =>
  text.replace(VARIABLE_REGEX, (match, variableName) => {
    const value = values && values[variableName];
    return value != null ? `${value}` : '?';
  });

export const t = (id: TranslationId, values?: Values) => {
  const translation = intl.messages[id] ?? id;
  return replaceValues(translation, values);
};

interface Props {
  id: TranslationId;
  values?: Values;
}

export const Translation = ({ id, values }: Props) => {
  const html = t(id, values);
  return <span data-id={id} dangerouslySetInnerHTML={{ __html: html }} />; // eslint-disable-line react/no-danger
};

export const changeLang = (langId: string) => {
  if (langId === intl.lang) return;
  Cookies.set('lang', langId, { expires: 365, path: '/' });
  Router.reload();
};

export const setIntl = (initialIntl: Intl) => {
  if (initialIntl) {
    intl.lang = initialIntl.lang;
    intl.messages = initialIntl.messages;
    publishDbgObject('intl', intl);
  }
};

export const InjectIntl = ({ intl: globalIntl }) => (
  <script
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: `var GLOBAL_INTL = ${JSON.stringify(globalIntl)};`,
    }}
  />
);

if (isBrowser()) {
  setIntl((window as any).GLOBAL_INTL);
}

export const setIntlForSSR = async (ctx) => {
  if (isServer()) {
    setIntl(await getServerIntl(ctx));
    await fetchSchemaTranslations(); // TODO import cycle
  }
};

// We got rid of intl context for easier usage. See commit "Intl: remove intlContext"
// Only drawback is page refresh while changing language... we can live with that :-)
// In future consider https://github.com/vinissimus/next-translate
