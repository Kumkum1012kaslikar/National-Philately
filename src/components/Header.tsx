"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getUser, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchSession = () => {
    setUser(getUser());
  };

  const updateCartCount = () => {
    if (typeof window === "undefined") return;
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        const items = JSON.parse(storedCart);
        const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchSession();
    updateCartCount();

    window.addEventListener("storage", fetchSession);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-updated", updateCartCount);
    return () => {
      window.removeEventListener("storage", fetchSession);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setCartCount(0);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-blue-800 tracking-tight hover:text-blue-900 transition-colors">
          National Community of Philatelists
        </Link>
        <nav aria-label="Main navigation" className="flex items-center">
          <ul className="flex space-x-6 items-center flex-wrap">
            <li>
              <Link
                href="/"
                className={`transition-colors font-medium ${
                  pathname === "/" ? "text-blue-900 font-semibold" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/catalog"
                className={`transition-colors font-medium ${
                  pathname === "/catalog" ? "text-blue-900 font-semibold" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                Catalog
              </Link>
            </li>
            <li>
              <Link
                href="/community"
                className={`transition-colors font-medium ${
                  pathname === "/community" ? "text-blue-900 font-semibold" : "text-blue-600 hover:text-blue-800"
                }`}
              >
                Community
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  href="/account"
                  className={`transition-colors font-medium ${
                    pathname === "/account" ? "text-blue-900 font-semibold" : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  Account
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/cart"
                className={`relative p-2 transition-colors flex items-center ${
                  pathname === "/cart" ? "text-blue-900" : "text-blue-600 hover:text-blue-800"
                }`}
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold shadow-sm animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/login">
                  <Button size="sm">Login</Button>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
