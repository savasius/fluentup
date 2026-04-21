"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, BookMarked, BookOpen } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";

interface WordResult {
  slug: string;
  word: string;
  cefr_level: string;
  part_of_speech: string;
}

interface GrammarResult {
  slug: string;
  title: string;
  cefr_level: string;
}

interface SearchResults {
  words: WordResult[];
  grammar: GrammarResult[];
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({
    words: [],
    grammar: [],
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ words: [], grammar: [] });
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal: ctrl.signal },
        );
        const data = (await res.json()) as SearchResults;
        setResults(data);
        trackEvent("search_performed", {
          query_length: query.length,
          results_count: (data.words?.length ?? 0) + (data.grammar?.length ?? 0),
        });
      } catch {
        // ignored — likely aborted
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      window.clearTimeout(timer);
      ctrl.abort();
    };
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const hasResults = results.words.length > 0 || results.grammar.length > 0;

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
          strokeWidth={2.5}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search words, grammar…"
          className="w-full bg-line-soft border border-line rounded-2xl py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-muted focus:outline-none focus:bg-white focus:border-primary transition"
        />
      </div>

      {open && query.length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-line rounded-2xl shadow-lift z-50 overflow-hidden">
          {loading && (
            <div className="p-4 text-sm text-ink-muted text-center">
              Searching…
            </div>
          )}

          {!loading && !hasResults && (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-ink-muted mx-auto mb-2" strokeWidth={2} />
              <p className="text-sm text-ink-muted">No matches for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-ink-muted mt-1">Try a different term</p>
            </div>
          )}

          {!loading && results.words.length > 0 && (
            <div className="p-2">
              <div className="px-2 py-1 text-xs font-bold uppercase tracking-widest text-ink-muted">
                Words
              </div>
              {results.words.map((w) => (
                <Link
                  key={w.slug}
                  href={`/vocabulary/${w.slug}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-line-soft transition"
                >
                  <BookMarked
                    className="w-4 h-4 text-primary flex-shrink-0"
                    strokeWidth={2.3}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink text-sm truncate">
                      {w.word}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {w.cefr_level} · {w.part_of_speech}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && results.grammar.length > 0 && (
            <div className="p-2 border-t border-line">
              <div className="px-2 py-1 text-xs font-bold uppercase tracking-widest text-ink-muted">
                Grammar
              </div>
              {results.grammar.map((g) => (
                <Link
                  key={g.slug}
                  href={`/grammar/${g.slug}`}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-line-soft transition"
                >
                  <BookOpen
                    className="w-4 h-4 text-success-dark flex-shrink-0"
                    strokeWidth={2.3}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-ink text-sm truncate">
                      {g.title}
                    </div>
                    <div className="text-xs text-ink-muted">{g.cefr_level}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
