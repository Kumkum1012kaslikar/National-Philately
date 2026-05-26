"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, MessageSquare, Users, Clock, MapPin, Plus, Search, UserPlus, UserMinus, UserCheck, Bell, X, Check, Tag } from "lucide-react";
import { getUser } from "@/lib/auth";

// Mock data
const initialForums = [
  {
    id: 1,
    title: "Rare Stamps from the Colonial Era",
    author: "StampExpert",
    replies: 23,
    views: 156,
  },
  {
    id: 2,
    title: "Tips for Preserving Old Postcards",
    author: "PreservationPro",
    replies: 15,
    views: 98,
  },
  {
    id: 3,
    title: "Upcoming Stamp Exhibitions in 2023",
    author: "EventOrganizer",
    replies: 31,
    views: 210,
  },
];

const initialEvents = [
  {
    id: 1,
    title: "National Philately Exhibition",
    date: "2026-08-15",
    time: "10:00 AM - 6:00 PM",
    venue: "Hall 5, Pragati Maidan",
    location: "New Delhi",
  },
  {
    id: 2,
    title: "Stamp Collectors Meetup",
    date: "2026-09-02",
    time: "2:00 PM - 5:00 PM",
    venue: "Nehru Centre Exhibition Hall, Worli",
    location: "Mumbai",
  },
  {
    id: 3,
    title: "Philately Workshop for Beginners",
    date: "2026-09-20",
    time: "11:00 AM - 1:30 PM",
    venue: "GPO Assembly Room, Raj Bhavan Road",
    location: "Bangalore",
  },
];

const initialMembers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Indian Classical Art Stamps",
    email: "rajesh@example.com",
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Wildlife Conservation Series",
    email: "priya@example.com",
  },
  {
    id: 3,
    name: "Amit Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Vintage Postcards",
    email: "amit@example.com",
  },
];

export default function Community() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("forums");
  const [user, setUser] = useState<any>(null);

  // Lists State
  const [forumList, setForumList] = useState(initialForums);
  const [eventList, setEventList] = useState(initialEvents);
  const [memberList, setMemberList] = useState(initialMembers);
  const [followingList, setFollowingList] = useState<string[]>([]);

  // Forums Tab State
  const [showForumForm, setShowForumForm] = useState(false);
  const [forumTitle, setForumTitle] = useState("");
  const [forumDescription, setForumDescription] = useState("");

  // Events Tab State
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  // Members Tab State
  const [searchMember, setSearchMember] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [memberSpecialty, setMemberSpecialty] = useState("");
  const [memberFilter, setMemberFilter] = useState<"all" | "following">("all");
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>({});
  const [followedByList, setFollowedByList] = useState<Record<string, boolean>>({});

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Selected Member for Collection Modal
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedMemberStamps, setSelectedMemberStamps] = useState<any[]>([]);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  const addNotification = (text: string, type: "connection" | "sale") => {
    const session = getUser();
    if (!session) return;
    const newNotif = {
      id: Date.now() + Math.random(),
      text,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type,
    };
    
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem(`notifications_${session.email}`, JSON.stringify(updated));
      return updated;
    });
  };

  const loadData = () => {
    const session = getUser();
    setUser(session);

    // Load forums
    const storedForums = localStorage.getItem("custom_forum_topics");
    if (storedForums) {
      try {
        setForumList([...initialForums, ...JSON.parse(storedForums)]);
      } catch (e) {
        console.error(e);
      }
    }

    // Load events
    const storedEvents = localStorage.getItem("custom_events");
    if (storedEvents) {
      try {
        setEventList([...initialEvents, ...JSON.parse(storedEvents)]);
      } catch (e) {
        console.error(e);
      }
    }

    // Load members
    let currentMembersList = initialMembers;
    const storedMembers = localStorage.getItem("custom_members");
    if (storedMembers) {
      try {
        currentMembersList = [...initialMembers, ...JSON.parse(storedMembers)];
        setMemberList(currentMembersList);
      } catch (e) {
        console.error(e);
      }
    } else {
      setMemberList(initialMembers);
    }

    // Load following list
    let currentFollowing: string[] = [];
    if (session) {
      const storedFollowing = localStorage.getItem(`following_${session.email}`);
      if (storedFollowing) {
        try {
          currentFollowing = JSON.parse(storedFollowing);
          setFollowingList(currentFollowing);
        } catch (e) {
          console.error(e);
        }
      } else {
        setFollowingList([]);
      }
    } else {
      setFollowingList([]);
    }

    // Load notifications
    if (session) {
      const storedNotifs = localStorage.getItem(`notifications_${session.email}`);
      if (storedNotifs) {
        try {
          setNotifications(JSON.parse(storedNotifs));
        } catch (e) {
          console.error(e);
        }
      } else {
        // Seed initial notifications to show how it works
        const seedNotifs = [
          {
            id: 1,
            text: "Priya Sharma connected with you.",
            timestamp: "10:30 AM",
            read: false,
            type: "connection",
          },
          {
            id: 2,
            text: "Amit Patel listed a new stamp for sale: 'Vintage Postcard (1920)'.",
            timestamp: "09:15 AM",
            read: false,
            type: "sale",
          }
        ];
        localStorage.setItem(`notifications_${session.email}`, JSON.stringify(seedNotifs));
        setNotifications(seedNotifs);
      }
    } else {
      setNotifications([]);
    }

    // Compute follower counts and who follows the current user
    const counts: Record<string, number> = {};
    const followedBy: Record<string, boolean> = {};

    // Initial default mock followers count to make design look rich
    counts["rajesh@example.com"] = 12;
    counts["priya@example.com"] = 18;
    counts["amit@example.com"] = 8;

    if (typeof window !== "undefined") {
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("following_")) {
            const listStr = localStorage.getItem(key);
            if (listStr) {
              const list = JSON.parse(listStr);
              if (Array.isArray(list)) {
                list.forEach((followedEmail) => {
                  if (counts[followedEmail] === undefined) {
                    counts[followedEmail] = 0;
                  }
                  counts[followedEmail] = counts[followedEmail] + 1;
                });
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (session) {
      currentMembersList.forEach((member) => {
        const key = `following_${member.email}`;
        const listStr = localStorage.getItem(key);
        if (listStr) {
          try {
            const list = JSON.parse(listStr);
            if (Array.isArray(list) && list.includes(session.email)) {
              followedBy[member.email] = true;
            }
          } catch (e) {
            console.error(e);
          }
        }
      });
    }

    setFollowerCounts(counts);
    setFollowedByList(followedBy);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("storage", loadData);
    return () => {
      window.removeEventListener("storage", loadData);
    };
  }, []);

  // FORUM SUBMISSION HANDLER
  const handleAddForumTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to start a new discussion.");
      router.push("/login");
      return;
    }

    if (!forumTitle.trim() || !forumDescription.trim()) {
      alert("Please fill in both the title and details.");
      return;
    }

    const newTopic = {
      id: Date.now(),
      title: forumTitle,
      author: user.name || user.email.split("@")[0],
      replies: 0,
      views: 1,
    };

    const storedForumsStr = localStorage.getItem("custom_forum_topics");
    const currentForums = storedForumsStr ? JSON.parse(storedForumsStr) : [];
    currentForums.unshift(newTopic);
    localStorage.setItem("custom_forum_topics", JSON.stringify(currentForums));

    setForumList((prev) => [newTopic, ...prev]);

    setForumTitle("");
    setForumDescription("");
    setShowForumForm(false);
    alert("New discussion forum topic posted successfully!");
  };

  // EVENT SUBMISSION HANDLER
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to list a community event.");
      return;
    }

    if (!eventTitle.trim() || !eventDate.trim() || !eventTime.trim() || !eventVenue.trim() || !eventLocation.trim()) {
      alert("Please fill in all the details.");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      venue: eventVenue,
      location: eventLocation,
    };

    const storedEventsStr = localStorage.getItem("custom_events");
    const currentEvents = storedEventsStr ? JSON.parse(storedEventsStr) : [];
    currentEvents.push(newEvent);
    localStorage.setItem("custom_events", JSON.stringify(currentEvents));

    setEventList((prev) => [...prev, newEvent]);

    setEventTitle("");
    setEventDate("");
    setEventTime("");
    setEventVenue("");
    setEventLocation("");
    setShowEventForm(false);
    alert("Your event has been successfully listed!");
  };

  // MEMBER JOIN/LEAVE HANDLERS
  const handleJoinCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first to join the community directory.");
      return;
    }

    if (!memberSpecialty.trim()) {
      alert("Please enter your stamp collecting specialty.");
      return;
    }

    const newMember = {
      id: Date.now(),
      name: user.name || user.email.split("@")[0],
      avatar: `/placeholder.svg?height=40&width=40`,
      specialty: memberSpecialty,
      email: user.email,
    };

    const storedMembersStr = localStorage.getItem("custom_members");
    const currentMembers = storedMembersStr ? JSON.parse(storedMembersStr) : [];
    currentMembers.push(newMember);
    localStorage.setItem("custom_members", JSON.stringify(currentMembers));

    setMemberList((prev) => [...prev, newMember]);
    setMemberSpecialty("");
    setShowJoinForm(false);
    alert("You have joined the community directory successfully!");
  };

  const handleLeaveCommunity = () => {
    if (!user) return;
    if (!confirm("Are you sure you want to remove your profile from the community members list?")) {
      return;
    }

    const storedMembersStr = localStorage.getItem("custom_members");
    if (storedMembersStr) {
      try {
        const currentMembers = JSON.parse(storedMembersStr);
        const filtered = currentMembers.filter((m: any) => m.email !== user.email);
        localStorage.setItem("custom_members", JSON.stringify(filtered));
        setMemberList([...initialMembers, ...filtered]);
        
        // Remove from following if they were following themselves somehow (not standard, but safe)
        const updatedFollowing = followingList.filter((email) => email !== user.email);
        setFollowingList(updatedFollowing);
        localStorage.setItem(`following_${user.email}`, JSON.stringify(updatedFollowing));

        alert("You have left the community directory.");
      } catch (e) {
        console.error(e);
      }
    }
  };

  // CONNECTION TOGGLE HANDLER
  const handleToggleFollow = (memberEmail: string) => {
    if (!user) {
      alert("Please login first to connect with other philatelists.");
      router.push("/login");
      return;
    }

    let updatedFollowing: string[];
    const isCurrentlyFollowing = followingList.includes(memberEmail);
    if (isCurrentlyFollowing) {
      // Unfollow
      updatedFollowing = followingList.filter((email) => email !== memberEmail);
    } else {
      // Follow
      updatedFollowing = [...followingList, memberEmail];
      // Notify immediately that user followed this member (useful local log)
      addNotification(`You connected with ${memberEmail.split("@")[0]}.`, "connection");
    }

    setFollowingList(updatedFollowing);
    localStorage.setItem(`following_${user.email}`, JSON.stringify(updatedFollowing));

    // Update followerCounts in state
    setFollowerCounts((prev) => {
      const currentCount = prev[memberEmail] || 0;
      const diff = isCurrentlyFollowing ? -1 : 1;
      return {
        ...prev,
        [memberEmail]: Math.max(0, currentCount + diff),
      };
    });
  };

  // Simulating live notifications when user connects to Rajesh Kumar
  useEffect(() => {
    if (!user) return;

    if (followingList.includes("rajesh@example.com")) {
      const key = `rajesh_sale_triggered_${user.email}`;
      if (!localStorage.getItem(key)) {
        const timer = setTimeout(() => {
          addNotification(
            "Rajesh Kumar listed a new stamp for sale: 'Historic Railway Stamp (1953)'.",
            "sale"
          );
          localStorage.setItem(key, "true");
          // Add this stamp to custom_stamps in localStorage so it can actually be bought!
          const storedStampsStr = localStorage.getItem("custom_stamps");
          const currentStamps = storedStampsStr ? JSON.parse(storedStampsStr) : [];
          if (!currentStamps.some((s: any) => s.id === 202)) {
            const newStamp = {
              id: 202,
              name: "Historic Railway Stamp (1953)",
              circle: "Mumbai Circle",
              price: 300,
              image: "/Train-stamps.jpg",
              sellerEmail: "rajesh@example.com"
            };
            currentStamps.push(newStamp);
            localStorage.setItem("custom_stamps", JSON.stringify(currentStamps));
          }
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [followingList, user]);

  // Simulate incoming connection request (Suresh Raina) after 10 seconds
  useEffect(() => {
    if (!user) return;
    
    const key = `incoming_conn_triggered_${user.email}`;
    if (!localStorage.getItem(key)) {
      const timer = setTimeout(() => {
        addNotification("Suresh Raina followed and connected with you.", "connection");
        
        // Add Suresh Raina to custom members directory
        const storedMembersStr = localStorage.getItem("custom_members");
        const currentMembers = storedMembersStr ? JSON.parse(storedMembersStr) : [];
        if (!currentMembers.some((m: any) => m.email === "suresh@example.com")) {
          const newMember = {
            id: 1001,
            name: "Suresh Raina",
            avatar: "/placeholder.svg?height=40&width=40",
            specialty: "Commemorative Cricket Series",
            email: "suresh@example.com",
          };
          currentMembers.push(newMember);
          localStorage.setItem("custom_members", JSON.stringify(currentMembers));
          setMemberList([...initialMembers, ...currentMembers]);
        }

        // Also add Suresh Raina's connection record following user in localStorage
        const sureshFollowingKey = `following_suresh@example.com`;
        const sureshFollowingStr = localStorage.getItem(sureshFollowingKey);
        const sureshFollowing = sureshFollowingStr ? JSON.parse(sureshFollowingStr) : [];
        if (!sureshFollowing.includes(user.email)) {
          sureshFollowing.push(user.email);
          localStorage.setItem(sureshFollowingKey, JSON.stringify(sureshFollowing));
        }

        // Update followedByList state to show "Follows you"
        setFollowedByList((prev) => ({
          ...prev,
          "suresh@example.com": true
        }));

        localStorage.setItem(key, "true");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Fetch collections stamps for a member
  const openMemberCollection = (member: any) => {
    setSelectedMember(member);
    
    let stamps: any[] = [];
    const customStampsStr = localStorage.getItem("custom_stamps");
    if (customStampsStr) {
      try {
        const custom = JSON.parse(customStampsStr);
        stamps = custom.filter((s: any) => s.sellerEmail === member.email);
      } catch (e) {
        console.error(e);
      }
    }
    
    // Seed initial mock stamps if they don't have custom ones, to show a rich UI
    if (member.email === "rajesh@example.com") {
      const mockStamps = [
        {
          id: 201,
          name: "Indian Classical Art Stamp",
          circle: "Delhi",
          price: 150,
          image: "/maha.png",
          sellerEmail: "rajesh@example.com"
        }
      ];
      // Avoid duplicates
      mockStamps.forEach(ms => {
        if (!stamps.some(s => s.id === ms.id)) {
          stamps.push(ms);
        }
      });
    } else if (member.email === "priya@example.com") {
      const mockStamps = [
        {
          id: 203,
          name: "Wildlife Tiger Series",
          circle: "Bengaluru Circle",
          price: 200,
          image: "/Train-stamps.jpg",
          sellerEmail: "priya@example.com"
        },
        {
          id: 204,
          name: "Rare Bird Series",
          circle: "Kolkata Circle",
          price: 120,
          image: "/maha.png",
          sellerEmail: "priya@example.com"
        }
      ];
      mockStamps.forEach(ms => {
        if (!stamps.some(s => s.id === ms.id)) {
          stamps.push(ms);
        }
      });
    } else if (member.email === "amit@example.com") {
      const mockStamps = [
        {
          id: 205,
          name: "Vintage Postcard (1920)",
          circle: "Chennai Circle",
          price: 90,
          image: "/taj mahal.jpg",
          sellerEmail: "amit@example.com"
        }
      ];
      mockStamps.forEach(ms => {
        if (!stamps.some(s => s.id === ms.id)) {
          stamps.push(ms);
        }
      });
    } else if (member.email === "suresh@example.com") {
      const mockStamps = [
        {
          id: 206,
          name: "1983 World Cup Victory Stamp",
          circle: "Mumbai Circle",
          price: 500,
          image: "/Train-stamps.jpg",
          sellerEmail: "suresh@example.com"
        }
      ];
      mockStamps.forEach(ms => {
        if (!stamps.some(s => s.id === ms.id)) {
          stamps.push(ms);
        }
      });
    }
    
    setSelectedMemberStamps(stamps);
  };

  const handleAddToCart = (item: any) => {
    const storedCart = localStorage.getItem("cart");
    const cart = storedCart ? JSON.parse(storedCart) : [];
    const existing = cart.find((c: any) => c.id === item.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    
    setAddedItemId(item.id);
    setTimeout(() => {
      setAddedItemId(null);
    }, 1200);
  };

  const isUserMember = user && memberList.some((m) => m.email === user.email);

  // Search filter
  const searchedMembers = memberList.filter(
    (m) =>
      m.name.toLowerCase().includes(searchMember.toLowerCase()) ||
      m.specialty.toLowerCase().includes(searchMember.toLowerCase())
  );

  const filteredMembers = searchedMembers.filter((m) => {
    if (memberFilter === "following") {
      return followingList.includes(m.email);
    }
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 flex-grow relative">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-blue-900">
          Philatelist Community
        </h2>
        
        {/* Notification Bell */}
        {user && (
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-blue-900"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-800">Notifications</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = notifications.map((n) => ({ ...n, read: true }));
                        setNotifications(updated);
                        localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updated));
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Mark all read
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => {
                        setNotifications([]);
                        localStorage.setItem(`notifications_${user.email}`, JSON.stringify([]));
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-xs font-medium">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          const updated = notifications.map((n) => n.id === notif.id ? { ...n, read: true } : n);
                          setNotifications(updated);
                          localStorage.setItem(`notifications_${user.email}`, JSON.stringify(updated));
                        }}
                        className={`p-3 hover:bg-gray-50 cursor-pointer flex gap-3 items-start transition-colors ${
                          !notif.read ? "bg-blue-50/20" : ""
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg text-white shrink-0 ${
                          notif.type === "connection" ? "bg-green-500" : "bg-blue-500"
                        }`}>
                          {notif.type === "connection" ? (
                            <UserPlus className="w-3.5 h-3.5" />
                          ) : (
                            <Tag className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className={`text-xs text-gray-700 leading-tight ${!notif.read ? "font-semibold" : ""}`}>
                            {notif.text}
                          </p>
                          <span className="text-[9px] text-gray-400 font-medium block mt-1">{notif.timestamp}</span>
                        </div>
                        {!notif.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        {/* FORUMS TAB */}
        <TabsContent value="forums">
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-lg font-semibold text-gray-700">Discussion Forums</h3>
              <Button onClick={() => setShowForumForm(!showForumForm)} className="bg-blue-800 hover:bg-blue-900">
                <Plus className="w-4 h-4 mr-1" />
                {showForumForm ? "Cancel" : "Start a Discussion"}
              </Button>
            </div>

            {showForumForm && (
              <Card className="border-blue-100 bg-blue-50/20">
                <CardHeader>
                  <CardTitle className="text-base">Start a New Discussion</CardTitle>
                  <CardDescription>Share your queries, discoveries, or topics with fellow collectors.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddForumTopic} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600">Discussion Title</label>
                      <Input
                        placeholder="e.g. How to verify watermarks on colonial stamps?"
                        value={forumTitle}
                        onChange={(e) => setForumTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600">Discussion Details / Question</label>
                      <textarea
                        rows={4}
                        placeholder="Provide more context for your discussion topic..."
                        className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={forumDescription}
                        onChange={(e) => setForumDescription(e.target.value)}
                        required
                      />
                    </div>
                    <Button className="w-full bg-blue-800 hover:bg-blue-900" type="submit">
                      Post Discussion Topic
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card className="border-gray-200">
              <CardHeader className="bg-blue-50/20">
                <CardTitle className="text-lg">Recent Discussions</CardTitle>
                <CardDescription>Engage in active threads and stamp debates</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  {forumList.map((topic) => (
                    <li key={topic.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h4 className="text-base font-semibold text-gray-800 hover:text-blue-700 cursor-pointer transition-colors mb-1">
                        {topic.title}
                      </h4>
                      <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>Started by <strong className="text-gray-700">{topic.author}</strong></span>
                        <span>
                          {topic.replies} replies • {topic.views} views
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* EVENTS TAB */}
        <TabsContent value="events">
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-lg font-semibold text-gray-700">Upcoming events & exhibitions</h3>
              <Button onClick={() => setShowEventForm(!showEventForm)} className="bg-blue-800 hover:bg-blue-900">
                <Plus className="w-4 h-4 mr-1" />
                {showEventForm ? "Cancel" : "Add Event"}
              </Button>
            </div>

            {showEventForm && (
              <Card className="border-blue-100 bg-blue-50/20">
                <CardHeader>
                  <CardTitle className="text-base">Post an Event</CardTitle>
                  <CardDescription>Share details of stamp meetups or exhibitions with the community.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600">Event Title</label>
                        <Input
                          placeholder="e.g. Independence Stamps Showcase"
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600">Date</label>
                        <Input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600">Time</label>
                        <Input
                          placeholder="e.g. 11:00 AM - 4:00 PM"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600">Exact Venue</label>
                        <Input
                          placeholder="e.g. Nehru Hall, Gate No. 2"
                          value={eventVenue}
                          onChange={(e) => setEventVenue(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-gray-600">City / Location</label>
                        <Input
                          placeholder="e.g. Kolkata Circle, West Bengal"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button className="w-full bg-blue-800 hover:bg-blue-900" type="submit">
                      Publish Event
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <ul className="space-y-6">
                  {eventList.map((event) => (
                    <li key={event.id} className="border-b pb-6 last:border-b-0 last:pb-0 flex flex-col gap-2">
                      <h4 className="text-xl font-bold text-gray-800">
                        {event.title}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-800">{event.venue}</p>
                            <p className="text-xs text-gray-500">{event.location}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* MEMBERS TAB */}
        <TabsContent value="members">
          <div className="space-y-6">
            {/* Search and Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={memberFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMemberFilter("all")}
                  className={memberFilter === "all" ? "bg-blue-800 hover:bg-blue-900 text-white" : "text-gray-700"}
                >
                  All Members ({searchedMembers.length})
                </Button>
                {user && (
                  <Button
                    variant={memberFilter === "following" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMemberFilter("following")}
                    className={memberFilter === "following" ? "bg-blue-800 hover:bg-blue-900 text-white" : "text-gray-700"}
                  >
                    Following ({followingList.length})
                  </Button>
                )}
              </div>

              <div className="relative flex-grow max-w-sm">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Search members by name or specialty..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                />
              </div>

              {user && (
                <div>
                  {isUserMember ? (
                    <Button onClick={handleLeaveCommunity} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                      <UserMinus className="w-4 h-4 mr-2" />
                      Leave Directory
                    </Button>
                  ) : (
                    <Button onClick={() => setShowJoinForm(!showJoinForm)} className="bg-blue-800 hover:bg-blue-900">
                      <UserPlus className="w-4 h-4 mr-2" />
                      {showJoinForm ? "Cancel Join" : "Join Directory"}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Join Specialty Input Form */}
            {showJoinForm && !isUserMember && (
              <Card className="border-blue-100 bg-blue-50/20 max-w-md">
                <CardHeader>
                  <CardTitle className="text-base">Join the Directory</CardTitle>
                  <CardDescription>Introduce yourself to other stamp collectors across the nation.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJoinCommunity} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600">Your Collecting Specialty</label>
                      <Input
                        placeholder="e.g. Modern Indian Stamps, Vintage Postcards"
                        value={memberSpecialty}
                        onChange={(e) => setMemberSpecialty(e.target.value)}
                        required
                      />
                    </div>
                    <Button className="w-full bg-blue-800 hover:bg-blue-900" type="submit">
                      Add Me to Directory
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Members Directory Card */}
            <Card className="border-gray-200">
              <CardHeader className="bg-blue-50/25">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Members Directory</span>
                </CardTitle>
                <CardDescription>Connect with fellow philatelists nationwide</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 border border-dashed rounded-lg">
                    <p className="text-gray-500 font-medium">
                      {memberFilter === "following" 
                        ? "You are not following/connected to any members yet." 
                        : `No members found matching "${searchMember}"`}
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-4 divide-y divide-gray-100">
                    {filteredMembers.map((member) => {
                      const isCurrentUser = user && member.email === user.email;
                      const isConnected = followingList.includes(member.email);
                      const isFollowingMe = followedByList[member.email];

                      return (
                        <li
                          key={member.id}
                          className="flex items-center justify-between pt-4 first:pt-0"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-10 h-10 border border-gray-100">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-blue-50 text-blue-800 font-bold">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5 flex-wrap">
                                {member.name}
                                {isCurrentUser && (
                                  <Badge variant="secondary" className="text-[9px] py-0 px-1.5 bg-blue-100 text-blue-800 font-bold">You</Badge>
                                )}
                                {isFollowingMe && (
                                  <Badge variant="outline" className="text-[9px] py-0 px-1.5 border-green-200 bg-green-50 text-green-700 font-medium animate-pulse">Follows you</Badge>
                                )}
                              </h4>
                              <p className="text-xs text-gray-500 font-medium mb-0.5">{member.specialty}</p>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                <span>{followerCounts[member.email] || 0} connections</span>
                                <span>•</span>
                                <span className="font-mono text-gray-400">{member.email}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {/* View Collection Button */}
                            {(isCurrentUser || isConnected) && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openMemberCollection(member)}
                                className="border-blue-200 text-blue-800 hover:bg-blue-50 text-xs shrink-0"
                              >
                                View Collection
                              </Button>
                            )}

                            {/* Follow/Connect Button */}
                            {!isCurrentUser && (
                              <Button
                                variant={isConnected ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleToggleFollow(member.email)}
                                className={`transition-colors flex items-center gap-1 text-xs shrink-0 ${
                                  isConnected
                                    ? "border-green-600 text-green-600 hover:border-red-600 hover:text-red-600 hover:bg-red-50 bg-green-50/20 group"
                                    : "bg-blue-800 hover:bg-blue-900"
                                }`}
                              >
                                {isConnected ? (
                                  <>
                                    <UserCheck className="w-3.5 h-3.5 group-hover:hidden" />
                                    <UserMinus className="w-3.5 h-3.5 hidden group-hover:inline" />
                                    <span className="group-hover:hidden">Connected / Following</span>
                                    <span className="hidden group-hover:inline">Disconnect / Unfollow</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="w-3.5 h-3.5" />
                                    <span>Connect / Follow</span>
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Member Collection Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
          <Card className="w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-gray-200">
            <CardHeader className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-row items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-white/20">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback className="bg-white/10 text-white font-bold">
                    {selectedMember.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    {selectedMember.name}'s Collection
                    {user && selectedMember.email === user.email && (
                      <Badge variant="secondary" className="text-[10px] bg-white/20 text-white border-none font-bold">You</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-xs mt-0.5">{selectedMember.specialty}</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedMember(null)}
                className="text-white hover:bg-white/10 rounded-full h-8 w-8"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto flex-grow bg-gray-50">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-base font-bold text-gray-700">Stamps Put Up For Sale</h3>
                <div className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
                  Collector ID: <span className="font-mono">{selectedMember.email}</span>
                </div>
              </div>
              {selectedMemberStamps.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed rounded-xl">
                  <p className="text-gray-400 font-medium">This collector has not listed any stamps for sale yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {selectedMemberStamps.map((stamp) => (
                    <Card key={stamp.id} className="bg-white flex flex-col h-full border border-gray-100 hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-bold text-gray-800 line-clamp-1">{stamp.name}</CardTitle>
                        <CardDescription className="text-[11px] text-gray-500 font-medium">{stamp.circle} Circle</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex-grow">
                        <div className="w-full h-32 mb-3 overflow-hidden rounded-md border border-gray-100 bg-gray-50 flex items-center justify-center">
                          <img
                            src={stamp.image}
                            alt={stamp.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg?height=150&width=200";
                            }}
                          />
                        </div>
                        <p className="text-lg font-bold text-blue-900">₹{stamp.price}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        {user && stamp.sellerEmail === user.email ? (
                          <Button disabled className="w-full bg-gray-100 text-gray-400 border border-gray-200" size="sm">
                            Your Stamp
                          </Button>
                        ) : (
                          <Button 
                            className={`w-full text-xs font-semibold ${
                              addedItemId === stamp.id 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-blue-800 hover:bg-blue-900 text-white"
                            }`}
                            onClick={() => handleAddToCart(stamp)}
                            size="sm"
                          >
                            {addedItemId === stamp.id ? "Added! ✓" : "Add to Cart"}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
