"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, category });
  };

  return (
    <section className="bg-muted py-4">
      <div className="max-w-6xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch gap-4"
        >
          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-40 bg-white border border-gray-300 dark:bg-zinc-800 dark:border-gray-700 rounded px-2 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="electronics">Electronics</option>
            <option value="fitness">Fitness</option>
            <option value="fashion">Fashion</option>
          </select>

          <Input
            name="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-white"
          />

          <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
