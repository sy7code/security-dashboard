"use client";

import ReactDiffViewer from "react-diff-viewer-continued";

interface CodeDiffViewerProps {
  originalCode: string;
  fixedCode: string;
}

export default function CodeDiffViewer({ originalCode, fixedCode }: CodeDiffViewerProps) {
  return (
    <div className="bg-[#111111] rounded-2xl border border-gray-800/60 overflow-hidden shadow-2xl">
      <div className="border-b border-gray-800/80 bg-[#161616] px-6 py-4 flex justify-between items-center">
        <h2 className="font-semibold text-gray-300 flex items-center gap-2">
          <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
          Proposed Changes
        </h2>
        <div className="flex gap-4 text-sm font-medium">
          <span className="text-red-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/50"></span> Original
          </span>
          <span className="text-green-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500/50"></span> AI Fixed
          </span>
        </div>
      </div>

      <div className="diff-viewer-container bg-[#0b0b0b]">
        <ReactDiffViewer
          oldValue={originalCode}
          newValue={fixedCode}
          splitView={true}
          useDarkTheme={true}
          leftTitle="Vulnerable Code"
          rightTitle="Auto-Healed Code"
          styles={{
            variables: {
              dark: {
                diffViewerBackground: '#0b0b0b',
                diffViewerColor: '#d4d4d4',
                addedBackground: 'rgba(22, 163, 74, 0.15)',
                addedColor: '#4ade80',
                removedBackground: 'rgba(220, 38, 38, 0.15)',
                removedColor: '#f87171',
                wordAddedBackground: 'rgba(22, 163, 74, 0.3)',
                wordRemovedBackground: 'rgba(220, 38, 38, 0.3)',
                addedGutterBackground: 'rgba(22, 163, 74, 0.1)',
                removedGutterBackground: 'rgba(220, 38, 38, 0.1)',
                gutterBackground: '#111111',
                gutterBackgroundDark: '#111111',
                highlightBackground: '#1a1a1a',
                highlightGutterBackground: '#1a1a1a',
                codeFoldGutterBackground: '#1a1a1a',
                codeFoldBackground: '#161616',
                emptyLineBackground: '#0b0b0b',
                gutterColor: '#6b7280',
                addedGutterColor: '#4ade80',
                removedGutterColor: '#f87171',
              }
            },
            contentText: {
              fontSize: '14px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }
          }}
        />
      </div>
    </div>
  );
}
