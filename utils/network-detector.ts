// Extend NetworkInformation interface
interface NetworkInformation {
  effectiveType?: string; // The connection type (e.g., '4g', '3g', etc.)
  downlink?: number; // Estimated download bandwidth in Mbps
  rtt?: number; // Estimated round-trip time in milliseconds
  addEventListener?: (event: string, callback: () => void) => void; // Listener for network changes
  removeEventListener?: (event: string, callback: () => void) => void; // Remove listener for network changes
}

// Extend Navigator interface to include connection property
declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

export class NetworkDetector {
  /**
   * Fetch network connection information.
   */
  static async getConnectionInfo() {
    if ((navigator as Navigator).connection) {
      const connection = (navigator as Navigator).connection;
      
      if (connection) {
        return {
          type: connection.effectiveType || "unknown", // Fallback for older browsers
          downlink: connection.downlink || Infinity, // Mbps
          rtt: connection.rtt || 0, // ms
        };
      }

    }
    return { type: "unknown", downlink: Infinity, rtt: 0 };
  }

  /**
   * Select appropriate bitrate based on network conditions.
   * @param options Custom thresholds for bitrate selection.
   */
  static async selectBitrate(options?: {
    cellularThreshold?: number;
    wifiThreshold?: number;
  }) {
    try {
      const { cellularThreshold = 0.7, wifiThreshold = 2.5 } = options || {};
      const { type, downlink } = await NetworkDetector.getConnectionInfo();

      if (type === "cellular") {
        return downlink > cellularThreshold ? "128k" : "64k"; // Mbps thresholds for cellular
      }

      return downlink > wifiThreshold ? "lossless" : "320k"; // Mbps thresholds for Wi-Fi
    } catch (error) {
      console.error("Error detecting network:", error);
      return "128k"; // Default to a safe bitrate
    }
  }

  /**
   * Add a listener for changes in network conditions.
   * @param callback Function to call when network information changes.
   */
  static addNetworkChangeListener(
    callback: (info: NetworkInformation) => void
  ) {
    const connection = navigator.connection as NetworkInformation | undefined;
    if (connection && connection.addEventListener) {
      connection.addEventListener("change", () => {
        callback(connection);
      });
    } else {
      console.warn("Network change listener not supported in this browser.");
    }
  }

  /**
   * Remove a listener for changes in network conditions.
   * @param callback Function to remove from network change listeners.
   */
  static removeNetworkChangeListener(
    callback: (info: NetworkInformation) => void
  ) {
    const connection = navigator.connection as NetworkInformation | undefined;
    if (connection && connection.removeEventListener) {
      connection.removeEventListener("change", () => {
        callback(connection);
      });
    }
  }
}
