/**
 * Utility function to generate time-based greetings
 * @returns An object containing greeting and quip messages based on the current time
 */
export function getTimeBasedGreeting(): { greeting: string; quip: string } {
  const hours = new Date().getHours();
  
  if (hours >= 5 && hours < 12) {
    return {
      greeting: "Good morning ☀️",
      quip: "Seizing the day already? ☕"
    };
  } else if (hours >= 12 && hours < 17) {
    return {
      greeting: "Good afternoon 🌞",
      quip: "A productive break, or just some digital wandering? 👀💡"
    };
  } else if (hours >= 17 && hours < 21) {
    return {
      greeting: "Good evening 🌆",
      quip: "Still in the zone? Keep going. 🚀"
    };
  } else {
    return {
      greeting: "Hello, night owl 🌙",
      quip: "Burning the midnight oil? 🔥💻"
    };
  }
}
