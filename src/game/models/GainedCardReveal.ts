export type GainedCardReveal = {
  id: string;
  kind: "Asset" | "Artifact" | "Spell";
  name: string;
  image?: string;
  description?: string;
};
