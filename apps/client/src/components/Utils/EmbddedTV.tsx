"use client";

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

export function EmbeddedTV({ viewSymbol }: { viewSymbol: string }) {

  const container = useRef<HTMLDivElement>(null);

  const { theme } = useTheme();

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "autosize": false,
        "symbol": "${viewSymbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "${theme}",
        "style": "8",
        "locale": "fr",
        "enable_publishing": false,
        "allow_symbol_change": false,
        "support_host": "https://www.tradingview.com"
      }`;
    container?.current?.appendChild(script);
  }, [viewSymbol, theme]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: '100%', width: '100%' }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: '100%', width: '100%' }}
      ></div>
    </div>
  );
}
