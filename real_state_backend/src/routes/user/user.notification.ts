import express, { NextFunction, Request, Response } from "express";
import { authMiddleware } from "../../middleware/auth";
import { validate, validateQuery } from "../../middleware/validate";
import {
  registerDeviceTokenSchema,
  unregisterDeviceTokenSchema,
  getNotificationsQuerySchema,
  sendTestNotificationSchema,
} from "../../validators/user.validator";
import {
  registerDeviceToken,
  unregisterDeviceToken,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  sendTestNotification,
} from "../../controllers/user/notification.controller";

const router = express.Router();

function requireNotificationTestSecret(req: Request, res: Response, next: NextFunction) {
  const expectedSecret = process.env.NOTIFICATION_TEST_SECRET;
  if (!expectedSecret) {
    return res.status(500).json({ message: "NOTIFICATION_TEST_SECRET is not configured" });
  }

  const providedSecret = req.header("x-notification-test-secret");
  if (!providedSecret || providedSecret !== expectedSecret) {
    return res.status(401).json({ message: "Invalid notification test secret" });
  }

  next();
}

// Public test route for quick server-side push validation
router.post("/test", requireNotificationTestSecret, validate(sendTestNotificationSchema), sendTestNotification);

router.use(authMiddleware);

router.post("/device-token", validate(registerDeviceTokenSchema), registerDeviceToken);
router.delete("/device-token", validate(unregisterDeviceTokenSchema), unregisterDeviceToken);

router.get("/", validateQuery(getNotificationsQuerySchema), getMyNotifications);
router.patch("/:notificationId/read", markNotificationAsRead);
router.patch("/read-all", markAllNotificationsAsRead);

export default router;
