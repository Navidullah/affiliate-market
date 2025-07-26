export async function GET() {
  const mockProducts = [
    {
      asin: "B09B8V8VK9",
      title: "Echo Dot (5th Gen)",
      description: "Smart speaker with Alexa and improved sound.",
      price: 49.99,
      rating: 4.5,
      reviews: 1320,
      category: "electronics",
      image: "/alexa.png",
      url: "https://www.amazon.com/dp/B09B8V8VK9?tag=hamraproduct-20",
    },
    {
      asin: "B0899Z4YPZ",
      title: "Anker Portable Charger",
      description: "High-capacity USB-C portable charger.",
      price: 34.99,
      rating: 4.7,
      reviews: 2230,
      category: "electronics",
      image: "https://m.media-amazon.com/images/I/71g40mlbinL._AC_SL1500_.jpg",
      url: "https://www.amazon.com/dp/B0899Z4YPZ?tag=hamraproduct-20",
    },
    {
      asin: "B0C8KNCT1Y",
      title: "Fitness Smartwatch",
      description: "Waterproof fitness tracker with heart rate monitor.",
      price: 29.99,
      rating: 4.2,
      reviews: 897,
      category: "fitness",
      image: "/waterproof.png",
      url: "https://www.amazon.com/dp/B0C8KNCT1Y?tag=hamraproduct-20",
    },
  ];

  return Response.json(mockProducts);
}
