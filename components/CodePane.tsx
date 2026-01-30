'use client';

import React from 'react';
import { Highlight } from 'prism-react-renderer';
import { cn } from '@/lib/utils';
import { getAlgorithmCode } from '@/lib/algorithms/code';
import { useSplitLayout } from '@/components/SplitLayout';

// Minimal Prism theme (works in light/dark via semantic colors)
const prismTheme = {
  plain: { color: 'var(--foreground)', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment'], style: { color: 'var(--muted-foreground)' } },
    { types: ['keyword', 'operator'], style: { color: 'var(--primary)' } },
    { types: ['string'], style: { color: 'var(--accent)' } },
    { types: ['number', 'boolean'], style: { color: 'var(--chart-3)' } },
    { types: ['function'], style: { color: 'var(--chart-2)' } },
    { types: ['punctuation'], style: { color: 'var(--muted-foreground)' } },
  ],
};

interface CodePaneProps {
  algorithmId: string;
  currentLine: number | null;
  className?: string;
  fullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export function CodePane({
  algorithmId,
  currentLine,
  className,
  fullscreen: fullscreenProp = false,
  onFullscreenToggle: onFullscreenToggleProp,
}: CodePaneProps) {
  const layout = useSplitLayout();
  const fullscreen = layout ? layout.codeFullscreen : fullscreenProp;
  const onFullscreenToggle = layout
    ? () => layout.setCodeFullscreen(!layout.codeFullscreen)
    : onFullscreenToggleProp;
  const info = getAlgorithmCode(algorithmId);

  if (!info) {
    return (
      <div className={cn('flex items-center justify-center p-8 bg-muted/30 rounded-lg', className)}>
        <p className="text-muted-foreground text-sm">No code available for this algorithm.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden',
        fullscreen && 'fixed inset-4 z-50 rounded-xl shadow-2xl',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-foreground">{info.name}</h3>
          <span className="text-xs text-muted-foreground font-mono">{info.complexity}</span>
        </div>
        {(onFullscreenToggle != null) && (
          <button
            type="button"
            onClick={onFullscreenToggle}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? '✕' : '⛶'}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4 text-sm">
        <Highlight
          code={info.code.trim()}
          language="javascript"
          theme={prismTheme}
        >
          {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={cn('m-0 font-mono', preClassName)} style={style}>
              <code>
                {tokens.map((line, idx) => {
                  const lineNum = idx + 1;
                  const isActive = currentLine !== null && currentLine === lineNum;
                  return (
                    <div
                      key={idx}
                      {...getLineProps({ line, key: idx })}
                      className={cn(
                        'flex gap-4 py-0.5 px-2 -mx-2 rounded transition-colors',
                        isActive && 'dsa-active-line border-l-2 border-primary'
                      )}
                      data-active={isActive}
                    >
                      <span className="select-none w-8 text-right text-muted-foreground shrink-0">
                        {lineNum}
                      </span>
                      <span className="flex-1 break-all">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token, key })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
