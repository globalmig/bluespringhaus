"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import React, { useState } from "react";

import InformationTab_artist from "./InformationTab_artist";
import type { Artists } from "@/types/inquiry";
import ReviewsTab_artist from "./ReviewsTab_artist";
import type { Reviews } from "@/types/Review";

interface tabProps {
  total: number;
  reviews: Reviews[];
  artist: Artists;
}

export default function Tab_artist({ total, reviews, artist }: tabProps) {
  const [selectedTab, setSelectedTab] = useState("information");
  return (
    <div>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        {/* 탭 리스트 */}
        <TabsList className="w-full flex justify-between  ">
          <TabsTrigger value="information" className={`flex-1 text-xl font-bold border-b py-4 ${selectedTab === "information" ? "text-blue-500 border-blue-500" : "text-gray-400 border-transparent"}`}>
            상세 정보
          </TabsTrigger>

          <TabsTrigger value="reviews" className={`flex-1 text-xl font-bold border-b py-4 ${selectedTab === "reviews" ? "text-blue-500 border-blue-500" : "text-gray-400 border-transparent"}`}>
            리뷰({total})
          </TabsTrigger>
        </TabsList>

        {/* 탭 내용 */}
        <TabsContent value="information" className="">
          <InformationTab_artist
            reviews={reviews}
            artist={{
              ...artist,
              profile_image: Array.isArray(artist.profile_image) ? artist.profile_image : [artist.profile_image],
            }}
          />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewsTab_artist reviews={reviews} artistId={artist.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
