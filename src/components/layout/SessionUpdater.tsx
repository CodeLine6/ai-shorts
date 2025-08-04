"use client"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

export function SessionUpdater() {
  const { data: session, update } = useSession();
  const userId = session?.user?._id as Id<"users"> | undefined;

  const userSubscription = useQuery(api.user.subscribeToUser, 
    userId ? { userId } : "skip"
  );

  useEffect(() => {
    if (userSubscription && session) {
      update({
        ...session,
        user: {
          ...session.user,
          ...userSubscription
        }
      });
    }
  }, [userSubscription]);

  return null;
}
