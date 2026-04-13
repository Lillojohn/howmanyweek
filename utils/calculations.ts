import lifeExpectancyData from "../data/lifeExpectancy.json";

type Gender = "male" | "female";

interface LifeExpectancy {
  male: number;
  female: number;
}

const data = lifeExpectancyData as Record<string, LifeExpectancy>;

export function getCountries(): string[] {
  return Object.keys(data).sort();
}

export function getLifeExpectancy(country: string, gender: Gender): number {
  const countryData = data[country];
  if (!countryData) return 75;
  return countryData[gender];
}

export function getWeeksLived(birthday: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - birthday.getTime();
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
}

export function getTotalWeeks(country: string, gender: Gender): number {
  const years = getLifeExpectancy(country, gender);
  return Math.round(years * 52.1429);
}

export function getWeeksRemaining(
  birthday: Date,
  country: string,
  gender: Gender
): number {
  const total = getTotalWeeks(country, gender);
  const lived = getWeeksLived(birthday);
  return Math.max(0, total - lived);
}

export function getPercentageLived(
  birthday: Date,
  country: string,
  gender: Gender
): number {
  const total = getTotalWeeks(country, gender);
  const lived = getWeeksLived(birthday);
  return Math.min(100, (lived / total) * 100);
}
