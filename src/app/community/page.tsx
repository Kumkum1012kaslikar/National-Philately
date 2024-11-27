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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MessageSquare, Users } from "lucide-react";

// Mock data
const forumTopics = [
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

const events = [
  {
    id: 1,
    title: "National Philately Exhibition",
    date: "2023-08-15",
    location: "New Delhi",
  },
  {
    id: 2,
    title: "Stamp Collectors Meetup",
    date: "2023-09-02",
    location: "Mumbai",
  },
  {
    id: 3,
    title: "Philately Workshop for Beginners",
    date: "2023-09-20",
    location: "Bangalore",
  },
];

const members = [
  {
    id: 1,
    name: "Rajesh Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Indian Classical Art Stamps",
  },
  {
    id: 2,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Wildlife Conservation Series",
  },
  {
    id: 3,
    name: "Amit Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    specialty: "Vintage Postcards",
  },
];

export default function Community() {
  const [activeTab, setActiveTab] = useState("forums");

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-blue-900 mb-8">
        Philatelist Community
      </h2>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="forums">
          <Card>
            <CardHeader>
              <CardTitle>Discussion Forums</CardTitle>
              <CardDescription>
                Engage in conversations with fellow philatelists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {forumTopics.map((topic) => (
                  <li key={topic.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="text-lg font-semibold mb-2">
                      {topic.title}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>By {topic.author}</span>
                      <span>
                        {topic.replies} replies • {topic.views} views
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Start a New Discussion
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Join philately events across India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {events.map((event) => (
                  <li key={event.id} className="border-b pb-4 last:border-b-0">
                    <h3 className="text-lg font-semibold mb-2">
                      {event.title}
                    </h3>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        <Calendar className="w-4 h-4 inline-block mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span>{event.location}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Featured Members</CardTitle>
              <CardDescription>
                Connect with passionate philatelists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
                  >
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{member.name}</h3>
                      <Badge variant="secondary">{member.specialty}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Browse All Members
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
