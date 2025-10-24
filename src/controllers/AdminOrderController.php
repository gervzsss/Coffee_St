<?php
namespace App\Controllers;

class AdminOrderController
{
  /**
   * Temporary: Returns sample orders for admin view.
   * Replace with real data source in production.
   * @return array
   */
  public static function getSampleOrders(): array
  {
    return [
      [
        "id" => "ORD-1234",
        "status" => "Pending",
        "urgent" => true,
        "customer_name" => "John Doe",
        "time_ago" => "920756 min ago",
        "address" => "123 Main St, Apt 4B, New York, NY 10001",
        "total" => 12.0,
        "item_count" => 2,
        "note" => "Extra hot, no foam",
      ],
      [
        "id" => "ORD-1235",
        "status" => "Processing",
        "customer_name" => "Bob Johnson",
        "time_ago" => "15 min ago",
        "address" => "456 Oak Ave, Brooklyn, NY 11201",
        "total" => 18.0,
        "item_count" => 3,
        "note" => "Extra caramel drizzle on all drinks",
      ],
    ];
  }
}
