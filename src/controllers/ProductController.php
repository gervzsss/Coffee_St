<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Repositories\ProductRepository;
use function App\Helpers\db;

class ProductController
{
  public function __construct(private ?ProductRepository $repo = null)
  {
    if ($this->repo === null) {
      $this->repo = new ProductRepository(db());
    }
  }

  /**
   * Return products for listing views.
   * @return array{products: array}\n   */
  public function listData(): array
  {
    $products = $this->repo->getAllActive();
    return ['products' => $products];
  }
}
