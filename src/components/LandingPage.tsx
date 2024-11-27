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
import Link from "next/link";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-blue-100 to-white"
      lang="en"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2"
      >
        Skip to main content
      </a>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">
            National Community of Philatelists
          </h1>
          <nav aria-label="Main navigation">
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

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
            />
            <Button>
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
          <Button size="lg">Sign Up Now</Button>
        </section>
      </main>

      <footer className="bg-blue-900 text-white py-8">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p>
            &copy; 2023 National Community of Philatelists. All rights reserved.
          </p>
          <nav aria-label="Footer navigation">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="hover:text-blue-300">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
