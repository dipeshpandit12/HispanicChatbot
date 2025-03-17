"use client";

import { useState, useEffect } from "react";

interface Place {
  display_name: string;
}

interface AddressAutoCompleteProps {
  value: string;
  onChange: (address: string) => void;
}

export default function AddressAutoComplete({ value, onChange }: AddressAutoCompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setError("");
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch addresses. Status: ${res.status}`);
        }

        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching address suggestions:", err);
        setError("Failed to fetch address suggestions. Please try again.");
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        className="w-full p-2 mt-1 border rounded-md"
        placeholder="Enter business address"
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-white border rounded-md shadow-md max-h-48 overflow-y-auto z-10">
          {suggestions.map((place, index) => (
            <li
              key={index}
              onClick={() => {
                onChange(place.display_name);
                setQuery(place.display_name);
                setSuggestions([]);
              }}
              className="p-2 cursor-pointer text-black"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
