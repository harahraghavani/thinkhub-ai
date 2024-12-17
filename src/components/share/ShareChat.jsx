"use client";
import React, { useEffect } from "react";
import { useFirebase } from "@/hooks/firebase/useFirebase";
import { useParams } from "next/navigation";

const ShareChat = () => {
  const params = useParams();
  const { firebaseMethods, states } = useFirebase();
  const { user } = states;
  const { isCurrentUserChat } = firebaseMethods;

  const getCurrentUserStatus = async () => {
    const isCurrentUser = await isCurrentUserChat(params?.id);
  };

  useEffect(() => {
    getCurrentUserStatus();
    // eslint-disable-next-line
  }, [params, user]);

  return <div>ShareChat</div>;
};

export default ShareChat;
