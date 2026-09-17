export function rollSingleDie(): number {
  return Math.floor(
    Math.random() * 6,
  ) + 1;
}