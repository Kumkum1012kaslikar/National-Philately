"use client";

import { useState } from "react";
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
const items = [
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
  // Add more items as needed
];

export default function Catalog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [circle, setCircle] = useState("all");

  const filteredItems = items.filter(
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
            {/* Add more circles as needed */}
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.circle} Circle</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-49 object-cover mb-4"
              />
              <p className="text-lg font-bold">₹{item.price}</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
