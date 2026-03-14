import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { DevicePlatform } from "@prisma/client";
import { NotificationType } from "@prisma/client";
import { createAndSendUserNotification } from "../../services/notification.service";

export async function registerDeviceToken(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const { token, platform } = req.body as { token: string; platform: DevicePlatform };

    const deviceToken = await prisma.userDeviceToken.upsert({
      where: { token },
      update: {
        userId,
        platform,
        isActive: true,
        lastSeenAt: new Date(),
      },
      create: {
        userId,
        token,
        platform,
        isActive: true,
        lastSeenAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Device token registered successfully",
      data: deviceToken,
    });
  } catch (error) {
    console.error("Register device token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function unregisterDeviceToken(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const { token } = req.body as { token: string };

    const existingToken = await prisma.userDeviceToken.findFirst({
      where: {
        userId,
        token,
      },
      select: {
        id: true,
      },
    });

    if (!existingToken) {
      return res.status(404).json({ message: "Device token not found" });
    }

    await prisma.userDeviceToken.update({
      where: { id: existingToken.id },
      data: {
        isActive: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Device token unregistered successfully",
    });
  } catch (error) {
    console.error("Unregister device token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMyNotifications(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const queryData = (req as any).validatedQuery || req.query;
    const page = Number(queryData.page) || 1;
    const limit = Number(queryData.limit) || 20;
    const isRead = queryData.isRead;

    const skip = (page - 1) * limit;

    const where: {
      userId: string;
      isRead?: boolean;
    } = {
      userId,
    };

    if (isRead !== undefined) {
      where.isRead = String(isRead).toLowerCase() === "true";
    }

    const [notifications, total] = await Promise.all([
      prisma.userNotification.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.userNotification.count({ where }),
    ]);

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function markNotificationAsRead(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const { notificationId } = req.params;

    const existingNotification = await prisma.userNotification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!existingNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    const notification = await prisma.userNotification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function markAllNotificationsAsRead(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    const result = await prisma.userNotification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        updatedCount: result.count,
      },
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendTestNotification(req: Request, res: Response) {
  try {
    const { userId, title, description } = req.body as {
      userId?: string;
      title?: string;
      description?: string;
    };

    const targetUserId = userId || req.user?.id;
    if (!targetUserId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const result = await createAndSendUserNotification({
      userId: targetUserId,
      type: NotificationType.GENERIC,
      title: title || "Test notification",
      description: description || "This is a test push notification from Realbro backend.",
      data: {
        source: "manual_test",
        createdAt: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Test notification triggered",
      data: result,
    });
  } catch (error) {
    console.error("Send test notification error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
