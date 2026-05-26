"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for philatelic items
const initialItems = [
  {
    id: 1,
    name: "Mahatma Gandhi Stamp",
    circle: "Delhi",
    price: 100,
    image: "/maha.png",
  },
  {
    id: 2,
    name: "Taj Mahal Postcard",
    circle: "Uttar Pradesh",
    price: 50,
    image: "/taj mahal.jpg",
  },
  {
    id: 3,
    name: "Indian Railways stamp",
    circle: "Maharashtra",
    price: 250,
    image: "/Train-stamps.jpg",
  },
];

function CatalogContent() {
  const searchParams = useSearchParams();
  const querySearch = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [circle, setCircle] = useState("all");
  const [catalogItems, setCatalogItems] = useState(initialItems);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  // Sync search box URL queries with page input state in real time
  useEffect(() => {
    setSearchTerm(querySearch);
  }, [querySearch]);

  useEffect(() => {
    const customStampsStr = localStorage.getItem("custom_stamps");
    if (customStampsStr) {
      try {
        const custom = JSON.parse(customStampsStr);
        setCatalogItems([...initialItems, ...custom]);
      } catch (e) {
        console.error("Error loading custom stamps:", e);
      }
    }
  }, []);

  const handleAddToCart = (item: typeof initialItems[0]) => {
    const storedCart = localStorage.getItem("cart");
    const cart = storedCart ? JSON.parse(storedCart) : [];
    const existing = cart.find((c: any) => c.id === item.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Notify header
    window.dispatchEvent(new Event("cart-updated"));
    
    // Provide visual feedback
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
    }, 1200);
  };

  const filteredItems = catalogItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (circle === "all" || item.circle === circle)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-blue-900 mb-8">
        Philatelic Catalog
      </h2>

      <div className="flex flex-wrap gap-4 mb-8">
        <Input
          className="flex-grow"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={circle} onValueChange={setCircle}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select circle" />
          </SelectTrigger>
          <SelectContent style={{ backgroundColor: "#808080" }}>
            <SelectItem value="all">All Circles</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
            <SelectItem value="Mumbai">Mumbai Circle</SelectItem>
            <SelectItem value="Bengaluru">Bengaluru Circle</SelectItem>
            <SelectItem value="Kolkata">Kolkata Circle</SelectItem>
            <SelectItem value="Chennai">Chennai Circle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 border border-dashed rounded-lg">
          <p className="text-gray-500 font-medium">No philatelic materials found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {filteredItems.map((item) => (
            <Card key={item.id} className="flex flex-col h-full border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 line-clamp-1">{item.name}</CardTitle>
                <CardDescription className="text-sm text-gray-500 font-medium">{item.circle} Circle</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="w-full h-48 mb-4 overflow-hidden rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=300";
                    }}
                  />
                </div>
                <p className="text-2xl font-bold text-blue-900">₹{item.price}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  className={`w-full transition-colors ${
                    addedItemId === item.id 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-blue-800 hover:bg-blue-900"
                  }`}
                  onClick={() => handleAddToCart(item)}
                >
                  {addedItemId === item.id ? "Added! ✓" : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center text-gray-500">Loading catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
