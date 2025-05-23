interface Props {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void; // ✅ new prop
}

const SearchBar = ({ value, onChange, onSearch }: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search movies..."
        onKeyDown={handleKeyDown} // ✅ trigger search on Enter
      />
      <button
        onClick={onSearch}
        className="search-button"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
