import { useState } from 'react';

export function KeyboardShortcutsButton() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 hover-lift"
      >
        ⌨️
      </button>

      {show && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShow(false)}
        >
          <div 
            className="glass-card max-w-2xl w-full p-8 rounded-3xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">⌨️ Keyboard Shortcuts</h2>
              <button
                onClick={() => setShow(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid gap-3">
              <ShortcutItem keys={['Alt', 'R']} description="Reset current snippet" />
              <ShortcutItem keys={['Tab']} description="Insert tab character" />
              <ShortcutItem keys={['Enter']} description="Insert newline" />
              <ShortcutItem keys={['Esc']} description="Blur from typing area" />
            </div>

            <div className="mt-6 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                💡 <strong>Pro tip:</strong> Practice your keyboard shortcuts to type faster!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl glass-card">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{description}</span>
      <div className="flex gap-2">
        {keys.map((key, i) => (
          <kbd key={i} className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 font-mono text-sm">
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}
