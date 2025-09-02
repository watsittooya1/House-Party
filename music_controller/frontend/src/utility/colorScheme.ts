const colorScheme = {
  darkGray: "#535353",
  gray: "#dedede",
  black: "#121212",
  white: "#ffffff",
  green: "#06c200",
};

// ? https://stackoverflow.com/a/28056903
export function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default colorScheme;
