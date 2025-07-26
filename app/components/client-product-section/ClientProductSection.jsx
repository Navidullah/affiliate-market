"use client";

import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import ProductCard from "../productcard/ProductCard";
import { toast } from "react-toastify";

export default function ClientProductSection() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load products.");
      }
    }
    fetchData();
  }, []);

  const handleSearch = ({ search, category }) => {
    setSearchTerm(search);
    const result = products.filter((item) => {
      const matchCategory = category === "all" || item.category === category;
      const matchSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    setFiltered(result);
    setPage(1);

    if (result.length === 0) toast.info("No products matched your search.");
  };

  const indexOfLast = page * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      <SearchBar onSearch={handleSearch} />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-4">
          🔥 Featured Products
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {["all", "electronics", "fitness"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleSearch({ search: "", category: cat })}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-sm rounded hover:bg-orange-500 hover:text-white capitalize transition"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No products found.
          </p>
        ) : (
          <>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Showing {currentItems.length} of {filtered.length} products
            </p>

            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {currentItems.map((product, i) => (
                <ProductCard key={i} {...product} searchTerm={searchTerm} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-muted-foreground pt-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
