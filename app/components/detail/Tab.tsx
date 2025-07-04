"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import React, { useState } from "react";
import InformationTab from "./InformationTab";
import ReviewsTab from "./ReviewsTab";

interface tabProps {
  total: number;
  reviews: Review[];
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  tags: string[];
}

export default function Tab({ total, reviews }: tabProps) {
  const [selectedTab, setSelectedTab] = useState("information");
  return (
    <div>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="w-full flex justify-between mb-6 ">
          <TabsTrigger value="information" className={`flex-1 text-xl font-bold border-b py-4 ${selectedTab === "information" ? "text-blue-500 border-blue-500" : "text-gray-400 border-transparent"}`}>
            상세 정보
          </TabsTrigger>

          <TabsTrigger value="reviews" className={`flex-1 text-xl font-bold border-b py-4 ${selectedTab === "reviews" ? "text-blue-500 border-blue-500" : "text-gray-400 border-transparent"}`}>
            리뷰({total})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="information" className="">
          <InformationTab reviews={reviews} />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewsTab reviews={reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
