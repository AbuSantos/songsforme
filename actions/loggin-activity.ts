"use server";
import { db } from "@/lib/db";
import { ActionType } from "@prisma/client";

export const logActivity = async (
  userId: string,
  action: ActionType,
  entityId: string,
  metadata: any
) => {
  try {
    await db.activity.upsert({
      where: {
        userId_action_entityId: {
          userId,
          action,
          entityId,
        },
      },
      update: {
        metadata,
      },

      create: {
        userId,
        action,
        entityId,
        metadata,
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};
