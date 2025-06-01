import React from "react";

interface SearchBarProps {
  value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}


const SearchBar = ({ value, onChange, placeholder = "Search..." } : SearchBarProps) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default SearchBar;