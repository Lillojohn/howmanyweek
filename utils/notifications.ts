import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getWeeksRemaining, getTotalWeeks, getWeeksLived } from "./calculations";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MESSAGES = [
  (weeks: number) => `${weeks.toLocaleString()} weeks left. What will you do with this one?`,
  (weeks: number, lived: number) => `Week ${lived.toLocaleString()} of your life. Make it matter.`,
  (weeks: number) => `${weeks.toLocaleString()} Mondays left. Start something today.`,
  (weeks: number) => `Another week alive. ${weeks.toLocaleString()} more to fill with meaning.`,
  (_w: number, _l: number, pct: number) => `You've lived ${pct.toFixed(0)}% of your life. The rest is up to you.`,
  (weeks: number) => `${weeks.toLocaleString()} weeks. Not infinite. Not zero. Go.`,
  (weeks: number) => `Time doesn't wait. ${weeks.toLocaleString()} weeks won't either.`,
  (weeks: number) => `${weeks.toLocaleString()} weeks remain. What's the one thing that matters this week?`,
  (_w: number, _l: number, pct: number) => `${(100 - pct).toFixed(0)}% of your life is unwritten. Write something worth reading.`,
  (weeks: number) => `You have ${weeks.toLocaleString()} chances left to have the best week of your life.`,
];

function getMotivationalMessage(
  birthday: string,
  country: string,
  gender: "male" | "female"
): string {
  const bday = new Date(birthday);
  const remaining = getWeeksRemaining(bday, country, gender);
  const lived = getWeeksLived(bday);
  const total = getTotalWeeks(country, gender);
  const pct = (lived / total) * 100;

  const index = Math.floor(Math.random() * MESSAGES.length);
  return MESSAGES[index](remaining, lived, pct);
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

  const message = getMotivationalMessage(birthday, country, gender);

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
