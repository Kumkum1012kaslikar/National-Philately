"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin, Mail, Tag, PlusCircle, Package, Info, Trash2 } from "lucide-react";
import { getUser } from "@/lib/auth";

interface Order {
  id: string;
  date: string;
  items: Array<{
    id: number;
    name: string;
    price: number;
    circle: string;
    image: string;
    quantity: number;
  }>;
  total: number;
  status: string;
}

interface CustomStamp {
  id: number;
  name: string;
  circle: string;
  price: number;
  image: string;
  sellerEmail: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [myListings, setMyListings] = useState<CustomStamp[]>([]);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");

  // Listing Form State
  const [stampName, setStampName] = useState("");
  const [stampCircle, setStampCircle] = useState("");
  const [stampPrice, setStampPrice] = useState("");
  const [stampTheme, setStampTheme] = useState("generic");
  const [stampImageFile, setStampImageFile] = useState("");
  const [showListingForm, setShowListingForm] = useState(false);
  const [listingSuccess, setListingSuccess] = useState("");

  const fetchAccountData = () => {
    const session = getUser();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session);
    setEditName(session.name || "");
    setEditAddress(session.address || "");

    // Fetch user orders
    const storedOrders = localStorage.getItem(`orders_${session.email}`);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }

    // Fetch user listed stamps
    const storedStamps = localStorage.getItem("custom_stamps");
    if (storedStamps) {
      try {
        const stamps: CustomStamp[] = JSON.parse(storedStamps);
        setMyListings(stamps.filter((s) => s.sellerEmail === session.email));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccountData();
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editAddress.trim()) {
      alert("Name and Address cannot be empty.");
      return;
    }

    const updatedUser = { ...user, name: editName, address: editAddress };

    // Update session in localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update registered_users list
    const registeredStr = localStorage.getItem("registered_users");
    if (registeredStr) {
      try {
        const registered = JSON.parse(registeredStr);
        if (registered[user.email]) {
          registered[user.email] = {
            ...registered[user.email],
            name: editName,
            address: editAddress
          };
          localStorage.setItem("registered_users", JSON.stringify(registered));
        }
      } catch (e) {
        console.error(e);
      }
    }

    setUser(updatedUser);
    setIsEditingProfile(false);
    
    // Dispatch session event to update components (e.g. Header if needed)
    window.dispatchEvent(new Event("storage"));
    alert("Profile updated successfully!");
  };

  const handleCancelOrder = (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: "Cancelled" };
      }
      return o;
    });

    setOrders(updatedOrders);
    localStorage.setItem(`orders_${user.email}`, JSON.stringify(updatedOrders));
    alert("Order cancelled successfully!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB to fit local browser storage limits.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setStampImageFile(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleListStamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stampName.trim() || !stampCircle.trim() || !stampPrice.trim()) {
      alert("Please fill out all listing details.");
      return;
    }

    // Resolve stamp theme image
    let imageUrl = stampImageFile || "/placeholder.svg?height=200&width=300";
    if (!stampImageFile) {
      if (stampTheme === "gandhi") imageUrl = "/maha.png";
      else if (stampTheme === "taj") imageUrl = "/taj mahal.jpg";
      else if (stampTheme === "railway") imageUrl = "/Train-stamps.jpg";
    }

    const newStamp: CustomStamp = {
      id: Date.now(), // Unique ID
      name: stampName,
      circle: stampCircle,
      price: Math.max(1, Number(stampPrice)),
      image: imageUrl,
      sellerEmail: user.email,
    };

    // Save to global custom_stamps in localStorage
    const storedStampsStr = localStorage.getItem("custom_stamps");
    const currentStamps = storedStampsStr ? JSON.parse(storedStampsStr) : [];
    currentStamps.push(newStamp);
    localStorage.setItem("custom_stamps", JSON.stringify(currentStamps));

    // Refresh listings state
    setMyListings((prev) => [...prev, newStamp]);

    // Reset Form
    setStampName("");
    setStampCircle("");
    setStampPrice("");
    setStampTheme("generic");
    setStampImageFile("");
    setShowListingForm(false);
    setListingSuccess("Stamp put up for sale successfully! It is now listed in the Catalog.");
    
    // Auto-clear success message
    setTimeout(() => {
      setListingSuccess("");
    }, 4000);
  };

  const handleDeleteStamp = (id: number) => {
    if (!confirm("Are you sure you want to remove this stamp listing from the catalog?")) {
      return;
    }

    const storedStampsStr = localStorage.getItem("custom_stamps");
    if (storedStampsStr) {
      try {
        const stamps: CustomStamp[] = JSON.parse(storedStampsStr);
        const filtered = stamps.filter((s) => s.id !== id);
        localStorage.setItem("custom_stamps", JSON.stringify(filtered));
        
        // Update local state
        setMyListings(filtered.filter((s) => s.sellerEmail === user.email));
        alert("Stamp listing removed successfully.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-medium">Checking authorization...</p>
      </div>
    );
  }

  // Tracking Stepper helper
  const renderTrackingTimeline = (status: string) => {
    if (status === "Cancelled") {
      return (
        <div className="mt-4 border-t pt-4 text-center">
          <Badge variant="secondary" className="bg-red-100 text-red-800 border-none font-bold py-1.5 px-4 rounded-full text-xs">
            Order Cancelled
          </Badge>
        </div>
      );
    }
    const steps = ["Processing", "Shipped", "Delivered"];
    const currentIndex = steps.indexOf(status);

    return (
      <div className="mt-4 border-t pt-4">
        <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Delivery Tracking</p>
        <div className="flex items-center justify-between max-w-sm mx-auto relative px-4">
          {/* Connector Line */}
          <div className="absolute top-3 left-8 right-8 h-0.5 bg-gray-200 -z-10">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIndex;
            const isActive = idx === currentIndex;

            return (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-colors ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  } ${isActive ? "ring-4 ring-green-100" : ""}`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold ${
                    isActive ? "text-green-600 font-bold" : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-grow">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-900 mb-2">
          Philatelist Account Dashboard
        </h2>
        <p className="text-gray-500 mb-8">Manage your profile, listings, purchases, and track active orders.</p>

        {listingSuccess && (
          <div className="mb-6 p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Info className="w-5 h-5" />
            {listingSuccess}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-8">
          {/* Dashboard Menu Tabs */}
          <div className="md:col-span-4">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="profile" className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Profile Details
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  Order Tracking ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="seller" className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  Seller Hub ({myListings.length})
                </TabsTrigger>
              </TabsList>

              {/* PROFILE TAB */}
              <TabsContent value="profile">
                <Card className="border-gray-200">
                  <CardHeader className="bg-blue-50/50 flex flex-row items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-lg">Personal Profile</CardTitle>
                      <CardDescription>Your registered details with the National Philatelists Community</CardDescription>
                    </div>
                    {!isEditingProfile && (
                      <Button onClick={() => setIsEditingProfile(true)} className="bg-blue-800 hover:bg-blue-900" size="sm">
                        Edit Profile
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isEditingProfile ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 block">Full Name</label>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-600 block">Delivery Address</label>
                          <textarea
                            rows={3}
                            className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={editAddress}
                            onChange={(e) => setEditAddress(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex gap-2 justify-end pt-2">
                          <Button type="button" variant="outline" onClick={() => {
                            setIsEditingProfile(false);
                            setEditName(user?.name || "");
                            setEditAddress(user?.address || "");
                          }}>
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-blue-800 hover:bg-blue-900">
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Full Name</p>
                            <p className="font-semibold text-gray-800 text-sm mt-0.5">{user?.name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Email Address</p>
                            <p className="font-semibold text-gray-800 text-sm mt-0.5">{user?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Phone Number</p>
                            <p className="font-semibold text-gray-800 text-sm mt-0.5">{user?.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Delivery Address</p>
                            <p className="font-semibold text-gray-800 text-sm mt-0.5 whitespace-pre-wrap">{user?.address}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ORDERS TAB */}
              <TabsContent value="orders">
                <div className="space-y-6">
                  {orders.length === 0 ? (
                    <Card className="text-center py-10 border-gray-200">
                      <CardContent>
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">You haven't placed any orders yet.</p>
                        <Link href="/catalog" className="text-xs text-blue-600 hover:underline mt-1 block">
                          Browse our stamp catalog and make your first purchase!
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id} className="border-gray-200 overflow-hidden">
                        <CardHeader className="bg-gray-50 border-b p-4 flex flex-row flex-wrap justify-between items-center gap-2">
                          <div>
                            <span className="text-xs font-bold text-blue-900">{order.id}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-xs text-gray-500">{order.date}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-900">Total: ₹{order.total.toFixed(2)}</span>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                          <div className="divide-y">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded border bg-gray-50" />
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.circle} Circle • Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          {renderTrackingTimeline(order.status)}

                          {order.status === "Processing" && (
                            <div className="flex justify-end mt-4 border-t pt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 text-xs font-bold"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancel Order
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* SELLER HUB TAB */}
              <TabsContent value="seller">
                <div className="space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h3 className="font-semibold text-gray-700">Stamps you listed for sale</h3>
                    <Button onClick={() => setShowListingForm(!showListingForm)} className="bg-blue-800 hover:bg-blue-900">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {showListingForm ? "Cancel Form" : "Put Stamp for Sale"}
                    </Button>
                  </div>

                  {showListingForm && (
                    <Card className="border-blue-100 bg-blue-50/20">
                      <CardHeader>
                        <CardTitle className="text-base">List a Stamp</CardTitle>
                        <CardDescription>Enter details to post your stamp on the public marketplace.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleListStamp} className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-gray-600">Stamp Name</label>
                              <Input
                                placeholder="e.g. Rare Nehru Centenary Stamp"
                                value={stampName}
                                onChange={(e) => setStampName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-gray-600">Postal Circle</label>
                              <Input
                                placeholder="e.g. Mumbai, Bengaluru, Kolkata"
                                value={stampCircle}
                                onChange={(e) => setStampCircle(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-gray-600">Selling Price (₹)</label>
                              <Input
                                type="number"
                                placeholder="Enter price in Rupees"
                                value={stampPrice}
                                onChange={(e) => setStampPrice(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-gray-600">Design Template (Image)</label>
                              <select
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                value={stampTheme}
                                onChange={(e) => setStampTheme(e.target.value)}
                              >
                                <option value="generic">Generic Stamp Template</option>
                                <option value="gandhi">Gandhi Stamp Template</option>
                                <option value="taj">Taj Mahal Postcard Template</option>
                                <option value="railway">Indian Railways Stamp Template</option>
                              </select>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-bold text-gray-600 block">Or Upload Custom Stamp Photo (Max 2MB)</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                              {stampImageFile && (
                                <div className="mt-2 flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100 w-fit">
                                  <img src={stampImageFile} className="w-14 h-14 object-cover rounded border" alt="Preview" />
                                  <button
                                    type="button"
                                    onClick={() => setStampImageFile("")}
                                    className="text-xs text-red-600 hover:underline font-semibold"
                                  >
                                    Remove Photo
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button className="w-full bg-blue-800 hover:bg-blue-900" type="submit">
                            Publish Stamp Listing
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {myListings.length === 0 ? (
                    <Card className="text-center py-10 border-gray-200">
                      <CardContent>
                        <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">You haven't listed any stamps for sale yet.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {myListings.map((stamp) => (
                        <Card key={stamp.id} className="overflow-hidden border-gray-200 flex items-center p-4 gap-4 hover:shadow-sm transition-shadow">
                          <img
                            src={stamp.image}
                            alt={stamp.name}
                            className="w-16 h-16 object-cover rounded border bg-gray-50 shrink-0"
                          />
                          <div className="flex-grow min-w-0">
                            <h4 className="font-semibold text-gray-800 text-sm truncate">{stamp.name}</h4>
                            <p className="text-xs text-gray-500">{stamp.circle} Circle</p>
                            <p className="text-sm font-bold text-blue-900 mt-1">₹{stamp.price}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStamp(stamp.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                            aria-label="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
