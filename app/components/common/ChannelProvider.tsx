// app/components/ChannelProvider.tsx
"use client";

import { useEffect } from "react";
import * as ChannelService from "@channel.io/channel-web-sdk-loader";

export default function ChannelProvider() {
  useEffect(() => {
    ChannelService.loadScript();

    // ✅ 옵션 설정 가능 (예: pluginKey)
    ChannelService.boot({
      pluginKey: process.env.NEXT_PUBLIC_CHANNEL_PLUGIN_KEY || "",
      //   memberId: "USER_ID", // 로그인 연동 시
      //   profile: {
      //     name: "", // 사용자 이름
      //     email: "user@email.com",
      //   },
    });

    return () => {
      ChannelService.shutdown();
    };
  }, []);

  return null;
}
