export interface Theme {
  colors: {
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    red: string;
    yellow: string;
    green: string;
    purple: string;
    inputBg: string;
    gridLived: string;
    gridRemaining: string;
    progressFill: string;
    buttonBg: string;
    buttonText: string;
    buttonDisabled: string;
  };
  border: number;
  shadow: number;
}

export const lightTheme: Theme = {
  colors: {
    background: "#e8e4de",
    card: "#fff",
    text: "#000",
    textSecondary: "#999",
    border: "#000",
    shadow: "#000",
    red: "#FF6B6B",
    yellow: "#FFD93D",
    green: "#A8E6CF",
    purple: "#C4B5FD",
    inputBg: "#fff",
    gridLived: "#000",
    gridRemaining: "#e8e4de",
    progressFill: "#FF6B6B",
    buttonBg: "#000",
    buttonText: "#fff",
    buttonDisabled: "#bbb",
  },
  border: 3,
  shadow: 5,
};

export const darkTheme: Theme = {
  colors: {
    background: "#1a1a2e",
    card: "#16213e",
    text: "#e8e4de",
    textSecondary: "#8888aa",
    border: "#e8e4de",
    shadow: "#000",
    red: "#ff2e63",
    yellow: "#ffd700",
    green: "#00ff88",
    purple: "#b537f2",
    inputBg: "#16213e",
    gridLived: "#ff2e63",
    gridRemaining: "#0f3460",
    progressFill: "#ff2e63",
    buttonBg: "#e8e4de",
    buttonText: "#1a1a2e",
    buttonDisabled: "#333",
  },
  border: 3,
  shadow: 5,
};
