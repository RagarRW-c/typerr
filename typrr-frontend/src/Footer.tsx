export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} typrr-like. Made with ❤️
          </div>
          
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              About
            </a>
            <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Terms
            </a>
            <a href="#" className="text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-4 text-xs text-center text-zinc-500">
          Practice coding typing skills with real code snippets
        </div>
      </div>
    </footer>
  );
}
