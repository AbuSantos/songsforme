function calculateDecayRate() {
  return Math.log(2) / 86400;
}

function unixTimestamp(date: Date) {
  return Math.floor(new Date(date).getTime() / 1000); // Convert to seconds
}

/**
 * Calculates the decayed play count for an array of plays.
 *
 * @param {Array} plays - Array of play objects, each containing a timestamp and count.
 * @param {number} decayRate - Rate at which the play influence decays over time.
 * @param {number} currentTime - The current time in the same units as play timestamps.
 * @returns {number} - Total decayed play count.
 */

export const calculateDecayedPlayCount = (
  plays: [],
  decayRate: GLfloat,
  currentTime: Number
) => {
  return plays?.reduce((total, play) => {
    //@ts-ignore
    const timeSincePlay = currentTime - unixTimestamp(play.timestamp);
    //@ts-ignore
    const decayedPlay = play.count * Math.exp(-decayRate * timeSincePlay);
    return total + decayedPlay;
  }, 0);
};
