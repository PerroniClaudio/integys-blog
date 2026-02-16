import React from 'react';
import { useTranslation } from '@/lib/useTranslation';

/**
 * I18nText: componente per interpolare placeholder (es. {{link}}) con React nodes.
 * Esempio d'uso:
 * <I18nText
 *   i18nKey="cookiesBanner.shortNoticeDescription"
 *   values={{
 *     link: <a href="...">Testo</a>,
 *     br: <br />
 *   }}
 * />
 */
interface I18nTextProps {
  i18nKey: string;
  values?: Record<string, React.ReactNode>;
}

const PLACEHOLDER_REGEX = /\{\{(\w+)\}\}/g;

export const I18nText: React.FC<I18nTextProps> = ({ i18nKey, values = {} }) => {
  const { t } = useTranslation();
  const raw = t(i18nKey);

  // Split la stringa su tutti i placeholder {{key}}
  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = PLACEHOLDER_REGEX.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      // Aggiungi testo prima del placeholder
      parts.push(raw.slice(lastIndex, match.index));
    }
    // Aggiungi il ReactNode corrispondente
    const key = match[1];
    if (values[key]) {
      parts.push(values[key]);
    } else {
      // Se non c'è, lascia il placeholder testuale
      parts.push(`{{${key}}}`);
    }
    lastIndex = match.index + match[0].length;
  }
  // Aggiungi il testo rimanente
  if (lastIndex < raw.length) {
    parts.push(raw.slice(lastIndex));
  }

  // Gestione \n e <br />
  const finalParts: (string | React.ReactNode)[] = [];
  parts.forEach((part, idx) => {
    if (typeof part === 'string') {
      // Split su \n o <br />
      const split = part.split(/\n|<br\s*\/?>(?![\s\S]*<br\s*\/?)/i);
      split.forEach((frag, i) => {
        if (i > 0) finalParts.push(<br key={`br-${idx}-${i}`} />);
        if (frag) finalParts.push(frag);
      });
    } else {
      finalParts.push(part);
    }
  });

  return <>{finalParts}</>;
};
