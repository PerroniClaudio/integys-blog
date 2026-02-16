'use client';

import { useLanguageFromURL } from '../hooks/useLanguageFromURL';

export default function LanguageSync() {
  // Questo componente si occupa solo di sincronizzare la lingua dall'URL
  useLanguageFromURL();
  return null;
}