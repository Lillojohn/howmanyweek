type MessageFn = (weeks: number, lived: number, pct: number) => string;

export const bluntMessages: MessageFn[] = [
  (w) => `${w.toLocaleString()} weeks left. What will you do with this one?`,
  (_w, l) => `Week ${l.toLocaleString()} of your life. Make it matter.`,
  (w) => `${w.toLocaleString()} Mondays left. Start something today.`,
  (w) => `Another week alive. ${w.toLocaleString()} more to fill with meaning.`,
  (_w, _l, p) => `You've lived ${p.toFixed(0)}% of your life. The rest is up to you.`,
  (w) => `${w.toLocaleString()} weeks. Not infinite. Not zero. Go.`,
  (w) => `Time doesn't wait. ${w.toLocaleString()} weeks won't either.`,
  (w) => `${w.toLocaleString()} weeks remain. What's the one thing that matters this week?`,
  (_w, _l, p) => `${(100 - p).toFixed(0)}% of your life is unwritten. Write something worth reading.`,
  (w) => `You have ${w.toLocaleString()} chances left to have the best week of your life.`,
];

export const gentleMessages: MessageFn[] = [
  (_w, l) => `Good morning. This is week ${l.toLocaleString()} of your beautiful life. What will you fill it with?`,
  (w) => `${w.toLocaleString()} weeks stretch ahead of you. Each one is a gift waiting to be opened.`,
  () => `A new week begins. Take a breath. You're here, and that's wonderful.`,
  (w) => `${w.toLocaleString()} more chances to laugh, to love, to grow. This week counts too.`,
  (_w, _l, p) => `You've journeyed through ${p.toFixed(0)}% of your story. The next chapter starts today.`,
  (w) => `${w.toLocaleString()} weeks of sunrises, conversations, and quiet moments still await you.`,
  () => `This week is a blank page. Fill it with something that makes you smile.`,
  (w) => `${w.toLocaleString()} more weeks of possibility. Be gentle with yourself in this one.`,
  () => `Another Monday, another beginning. What small joy will you find today?`,
  (_w, l) => `Week ${l.toLocaleString()}. You've come so far. Keep going, one day at a time.`,
];

export const stoicMessages: MessageFn[] = [
  () => `"You could leave life right now. Let that determine what you do and say and think." — Marcus Aurelius`,
  (w) => `${w.toLocaleString()} weeks remain. "It is not that we have a short time to live, but that we waste a great deal of it." — Seneca`,
  () => `"The happiness of your life depends upon the quality of your thoughts." — Marcus Aurelius`,
  () => `"We suffer more often in imagination than in reality." — Seneca`,
  () => `"First say to yourself what you would be; then do what you have to do." — Epictetus`,
  (w) => `${w.toLocaleString()} weeks. "Waste no more time arguing about what a good man should be. Be one." — Marcus Aurelius`,
  () => `"The obstacle is the way." — Marcus Aurelius`,
  () => `"No man is free who is not master of himself." — Epictetus`,
  () => `"Begin at once to live, and count each separate day as a separate life." — Seneca`,
  (_w, _l, p) => `${p.toFixed(0)}% lived. "How long are you going to wait before you demand the best for yourself?" — Epictetus`,
];
