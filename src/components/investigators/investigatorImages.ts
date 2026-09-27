function getInvestigatorFileName(name: string): string {
  return name.trim().replace(/\s+/g, "_");
}

export function getInvestigatorFrontImage(name: string): string {
  const fileName = getInvestigatorFileName(name);
  return `/cards/investigators/${fileName}/${fileName}-front.png`;
}

export function getInvestigatorBackImage(name: string): string {
  const fileName = getInvestigatorFileName(name);
  return `/cards/investigators/${fileName}/${fileName}-back.png`;
}
