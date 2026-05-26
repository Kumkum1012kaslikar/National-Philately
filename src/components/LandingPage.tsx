"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Stamp, Users, CreditCard, Search } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/catalog");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-100 to-white"
      lang="en"
    >
      <main id="main-content" className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">
            Discover the World of Indian Philately
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Access philatelic materials from across India, all in one place.
          </p>
          <div className="flex justify-center">
            <Input
              className="w-64 mr-2"
              placeholder="Search for stamps, postcards..."
              aria-label="Search for stamps or postcards"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Stamp
                className="w-8 h-8 text-blue-500 mb-2"
                aria-hidden="true"
              />
              <CardTitle>Extensive Catalog</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Browse philatelic materials from all postal circles across
                India.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CreditCard
                className="w-8 h-8 text-blue-500 mb-2"
                aria-hidden="true"
              />
              <CardTitle>National Philately Deposit Account</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage your purchases and deposits with ease.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users
                className="w-8 h-8 text-blue-500 mb-2"
                aria-hidden="true"
              />
              <CardTitle>Vibrant Community</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect with fellow philatelists from across the country.
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">
            Join Our Community Today
          </h3>
          <p className="text-gray-600 mb-8">
            Start your philatelic journey with access to nationwide releases and
            a supportive community.
          </p>
          <Link href="/login?tab=signup">
            <Button size="lg">Sign Up Now</Button>
          </Link>
        </section>
      </main>    </div>
  );
}
