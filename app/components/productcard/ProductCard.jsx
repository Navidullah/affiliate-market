"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

export default function ProductCard({
  title,
  image,
  description,
  url,
  category,
  price = 0,
  discount,
  rating = 0,
  reviews = 0,
  searchTerm = "",
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCart();

  const highlightText = (text) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Card className="hover:shadow-lg transition h-full flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 space-y-2 relative">
        {discount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            -{discount}%
          </div>
        )}

        <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full capitalize dark:bg-blue-900 dark:text-blue-300">
          {category || "Other"}
        </span>

        <CardTitle className="text-base font-semibold">
          {highlightText(title)}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col justify-between flex-1 p-4 pt-2">
        <div className="w-full h-40 flex justify-center items-center overflow-hidden mb-4">
          <img
            src={image}
            alt={title}
            className="object-contain h-full max-h-40 w-auto"
          />
        </div>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.round(rating) ? "#facc15" : "none"}
                stroke="#facc15"
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">
              ({reviews})
            </span>
          </div>

          <div className="text-sm font-semibold text-green-500 dark:text-green-400">
            ${price.toFixed(2)}
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="text-gray-400 hover:text-red-500 transition"
            aria-label="Add to Wishlist"
          >
            <Heart fill={wishlisted ? "#ef4444" : "none"} />
          </button>
        </div>

        <div className="flex gap-2 mt-auto">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white">
              Buy on Amazon
            </Button>
          </a>

          <Button
            variant="outline"
            className="cursor-pointer flex items-center justify-center gap-2"
            onClick={() => {
              addToCart({ title, image, price, url, quantity: 1 });
              toast.success(`${title} added to cart! 🛒`);
            }}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
