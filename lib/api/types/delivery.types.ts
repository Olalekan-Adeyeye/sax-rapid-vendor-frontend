export type DeliveryProvider =
  | "Uber"
  | "Bolt"
  | "Manual"
  | "Sendbox"
  | "TheCourierGuy";

export type DeliveryStatus =
  | "Pending"
  | "Requested"
  | "RiderAssigned"
  | "PickedUp"
  | "InTransit"
  | "Delivered"
  | "Failed"
  | "Cancelled";
