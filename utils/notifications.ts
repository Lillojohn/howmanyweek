import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getWeeksRemaining, getTotalWeeks, getWeeksLived } from "./calculations";
import { bluntMessages, gentleMessages, stoicMessages } from "../data/notificationMessages";
import { getSettings } from "./settings";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function getMotivationalMessage(
  birthday: string,
  country: string,
  gender: "male" | "female",
  tone: "blunt" | "gentle" | "stoic" = "blunt"
): string {
  const bday = new Date(birthday);
  const remaining = getWeeksRemaining(bday, country, gender);
  const lived = getWeeksLived(bday);
  const total = getTotalWeeks(country, gender);
  const pct = (lived / total) * 100;

  const messages =
    tone === "gentle" ? gentleMessages : tone === "stoic" ? stoicMessages : bluntMessages;

  const index = Math.floor(Math.random() * messages.length);
  return messages[index](remaining, lived, pct);
}

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("weekly", {
      name: "Weekly Reminder",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleWeeklyNotification(
  birthday: string,
  country: string,
  gender: "male" | "female"
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const settings = await getSettings();
  const message = getMotivationalMessage(birthday, country, gender, settings.notificationTone);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "WEEKS LEFT",
      body: message,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 2, // Monday
      hour: 8,
      minute: 0,
    },
  });
}

export async function cancelNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
