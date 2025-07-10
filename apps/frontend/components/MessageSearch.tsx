"use client";

import { useState, useEffect } from "react";

interface SearchResult {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

interface MessageSearchProps {
  onSearch: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
}

export default function MessageSearch({
  onSearch,
  results,
  isLoading,
}: MessageSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim().length > 2) {
        onSearch(query.trim());
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("uk-UA");
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Пошук повідомлень..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Пошук...</div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.id}
                className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">
                    {result.profiles.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(result.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{result.content}</p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Нічого не знайдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}
