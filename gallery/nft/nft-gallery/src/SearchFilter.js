import React from "react";

function SearchFilter({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by graduate name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "10px",
        width: "100%",
        marginBottom: "20px",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    />
  );
}

export default SearchFilter;
