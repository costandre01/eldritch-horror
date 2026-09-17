export interface TravelMove {
  fromSpaceId: string;
  toSpaceId: string;

  ticketUsed: "train" | "ship" | null;
}