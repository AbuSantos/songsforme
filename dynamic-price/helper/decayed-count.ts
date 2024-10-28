function calculateDecayRate() {
  return Math.log(2) / 86400;
}

export const calculateDecayedPlayCount = (
  plays: [],
  decayRate,
  currentTime
) => {
  return plays.reduce((total, play) => {
    const timeSincePlay = currentTime - play.timestamp;
    const decayedPlay = play.count * Math.exp(-decayRate * timeSincePlay);
    return total + decayedPlay;
  }, 0);
};

function calculateDecayedPlayCount(plays, decayRate, currentTime) {
    return plays.reduce((acc, play) => {
        const timeDiff = currentTime - play.timestamp; // Time since play in seconds
        const decayedPlay = play.count * Math.exp(-decayRate * timeDiff);
        return acc + decayedPlay;
    }, 0);
}

function calculateDynamicPrice(basePrice, recentPlays, recentPlaylists, recentListeners) {
    const k = 0.0005; // Growth rate for decayed play count
    const alpha = 0.02; // Weight of playlist factor
    const beta = 0.03; // Weight of unique listeners factor
    const decayRate = 0.0001; // Decay rate for play influence

    // Decayed play count based on recent plays and decay rate
    const currentTime = Date.now() / 1000; // Current time in seconds
    const decayedPlayCount = calculateDecayedPlayCount(recentPlays, decayRate, currentTime);

    // Logarithmic growth modifiers for playlists and unique listeners
    const playlistFactor = 1 + alpha * Math.log(1 + recentPlaylists);
    const listenerFactor = 1 + beta * Math.log(1 + recentListeners);

    // Calculate final price with all factors
    const dynamicPrice = basePrice * Math.exp(k * decayedPlayCount) * playlistFactor * listenerFactor;

    return parseFloat(dynamicPrice.toFixed(4)); // Return price rounded to 4 decimal places
}

// Example usage
const basePrice = 1.0; // Initial NFT price, in ETH

// Example play data with timestamps (in seconds) and counts
const recentPlays = [
    { timestamp: Date.now() / 1000 - 86400, count: 100 }, // Played 1 day ago
    { timestamp: Date.now() / 1000 - 172800, count: 50 }, // Played 2 days ago
    { timestamp: Date.now() / 1000 - 259200, count: 150 }, // Played 3 days ago
];

const recentPlaylists = 10; // Number of playlists NFT was added to in last 30 days
const recentListeners = 20; // Number of unique listeners in last 30 days

const price = calculateDynamicPrice(basePrice, recentPlays, recentPlaylists, recentListeners);
console.log(`Dynamic NFT Price with Fluctuation: ${price} ETH`);
