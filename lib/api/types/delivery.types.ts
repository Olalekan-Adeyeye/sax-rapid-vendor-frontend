export type DeliveryProvider = "Uber" | "Bolt" | "Manual";

export type DeliveryStatus =
  | "Pending"
  | "Requested"
  | "RiderAssigned"
  | "PickedUp"
  | "InTransit"
  | "Delivered"
  | "Failed"
  | "Cancelled";
