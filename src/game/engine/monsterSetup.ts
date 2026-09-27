/** Monsters removed from the Monster Cup during Ancient One setup. */
export function getSetAsideMonsterCounts(
  ancientOneId: string,
): Record<string, number> {
  switch (ancientOneId) {
    case "cthulhu":
      return { "deep-one": 1, "star-spawn": 1 };
    case "shub-niggurath":
      return { ghoul: 2, "goat-spawn": 2, "dark-young": 1 };
    default:
      return {};
  }
}
