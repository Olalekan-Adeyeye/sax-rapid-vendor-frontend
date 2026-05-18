import { OrderStatus } from "@/lib/api/types/orders.types";

export function getOrderStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Processing:
      return "text-blue-600 bg-blue-50";
    case OrderStatus.Delivered:
      return "text-green-600 bg-green-50";
    case OrderStatus.Pending:
      return "text-gold bg-gold/10";
    case OrderStatus.Cancelled:
    case OrderStatus.Failed:
      return "text-red-600 bg-red-50";
    case OrderStatus.Shipped:
      return "text-purple-600 bg-purple-50";
    case OrderStatus.Confirmed:
      return "text-blue-600 bg-blue-50";
    case OrderStatus.OnHold:
      return "text-amber-600 bg-amber-50";
    case OrderStatus.Dispute:
      return "text-orange-600 bg-orange-50";
    case OrderStatus.Refunded:
      return "text-gray-600 bg-gray-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}
