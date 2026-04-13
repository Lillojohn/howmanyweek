import { getUserData } from "./storage";
import { getWeeksRemaining, getWeeksLived, getTotalWeeks, getPercentageLived } from "./calculations";

const QUOTES = [
  "Make this week count.",
  "Not infinite. Not zero. Go.",
  "What matters this week?",
  "You're still here. Go.",
  "Another chance. Use it.",
];

export async function updateWidget(): Promise<void> {
  try {
    // Dynamic import — widget module only exists after prebuild
    const WeeksLeftWidget = require("../widgets/WeeksLeftWidget").default;

    const data = await getUserData();
    if (!data) return;

    const birthday = new Date(data.birthday);
    const weeksRemaining = getWeeksRemaining(birthday, data.country, data.gender);
    const weeksLived = getWeeksLived(birthday);
    const totalWeeks = getTotalWeeks(data.country, data.gender);
    const percentage = getPercentageLived(birthday, data.country, data.gender);
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    WeeksLeftWidget.updateSnapshot({
      weeksRemaining,
      weeksLived,
      totalWeeks,
      percentage,
      quote,
    });
  } catch {
    // Widget not available (Expo Go or Android)
  }
}
