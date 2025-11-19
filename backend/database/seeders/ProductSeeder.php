<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'id' => 1,
                'category' => 'hot-coffee',
                'name' => 'Americano',
                'description' => 'A cool blend of espresso and chilled water, served over ice for a crisp and light finish.',
                'price' => 95.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761317233/products/americano-68fb916de1765.png',
                'is_active' => 1,
            ],
            [
                'id' => 2,
                'category' => 'pastries',
                'name' => 'Cinnamon Roll',
                'description' => 'Warm, soft roll swirled with cinnamon sugar and topped with rich cream cheese frosting.',
                'price' => 80.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761317649/products/cinammon-68fb930c670dc.png',
                'is_active' => 1,
            ],
            [
                'id' => 3,
                'category' => 'iced-coffee',
                'name' => 'Cappuccino',
                'description' => 'Freshly brewed espresso balanced with steamed milk and a velvety foam finish.',
                'price' => 110.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761326259/products/CAPUCCINO-68fbb4b1e30b3.png',
                'is_active' => 1,
            ],
            [
                'id' => 4,
                'category' => 'non-coffee',
                'name' => 'Raspeberry Tea',
                'description' => 'No description yet for this product',
                'price' => 65.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761371183/products/Raspberry_tea-68fc6410c28b7.png',
                'is_active' => 1,
            ],
            [
                'id' => 5,
                'category' => 'frappe',
                'name' => 'Blueberry Frappe',
                'description' => 'No description yet for this product',
                'price' => 89.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761371469/products/blueberry_frappe-5.png',
                'is_active' => 1,
            ],
            [
                'id' => 6,
                'category' => 'frappe',
                'name' => 'Choco Chip',
                'description' => 'No description yet for this product',
                'price' => 999.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761371319/products/CHOCOCHIP-6.png',
                'is_active' => 1,
            ],
            [
                'id' => 7,
                'category' => 'frappe',
                'name' => 'Salted Caramel',
                'description' => 'No description yet for this product',
                'price' => 999.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761372526/products/Salted_caramel-68fc696c94b25.png',
                'is_active' => 1,
            ],
            [
                'id' => 8,
                'category' => 'pastries',
                'name' => 'Cookie',
                'description' => 'No description yet for this product.',
                'price' => 9999.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761372699/products/cookies-68fc6a19aea84.png',
                'is_active' => 1,
            ],
            [
                'id' => 9,
                'category' => 'pastries',
                'name' => 'Red Velvet Cookie',
                'description' => 'No description yet for this product.',
                'price' => 1.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761373153/products/RED_VELVE_COOKIES-68fc6bdec141c.png',
                'is_active' => 1,
            ],
            [
                'id' => 10,
                'category' => 'pastries',
                'name' => 'White Chocolate',
                'description' => 'No description yet for this product',
                'price' => 10999.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761373257/products/white_chocolate-68fc6c47bbb70.png',
                'is_active' => 1,
            ],
            [
                'id' => 11,
                'category' => 'frappe',
                'name' => 'Ube Frappe',
                'description' => 'No description yet for this product.',
                'price' => 95.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761373632/products/UBE%20FRAPPE-68fc6dbe9ab9a.png',
                'is_active' => 1,
            ],
            [
                'id' => 12,
                'category' => 'frappe',
                'name' => 'Strawberry Frappe',
                'description' => 'No description yet for this product.',
                'price' => 50000.65,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761373963/products/STRAWBEERY_FRAPPE-68fc6f0a39048.png',
                'is_active' => 1,
            ],
            [
                'id' => 13,
                'category' => 'frappe',
                'name' => 'Vanilla Latte',
                'description' => 'No description yet for this product.',
                'price' => 89.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761374132/products/VANILLA%20LATTE-68fc6f836ce0a.png',
                'is_active' => 1,
            ],
            [
                'id' => 14,
                'category' => 'hot-coffee',
                'name' => 'White Mocha',
                'description' => 'No description for this product yet.',
                'price' => 69.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761390498/products/white_mocha-68fcaf9fbd61c.png',
                'is_active' => 1,
            ],
            [
                'id' => 15,
                'category' => 'non-coffee',
                'name' => 'Lemon Tea',
                'description' => 'No description for this product yet.',
                'price' => 79.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761390642/products/lemon_tea-15.png',
                'is_active' => 1,
            ],
            [
                'id' => 16,
                'category' => 'iced-coffee',
                'name' => 'Matcha',
                'description' => 'No description for this product yet.',
                'price' => 1.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391021/products/Matcha-68fcb1aa6c31c.png',
                'is_active' => 1,
            ],
            [
                'id' => 17,
                'category' => 'iced-coffee',
                'name' => 'Noir Mocha',
                'description' => 'No description for this product yet.',
                'price' => 95.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391081/products/Noir_Mocha-68fcb1e57225f.png',
                'is_active' => 1,
            ],
            [
                'id' => 18,
                'category' => 'iced-coffee',
                'name' => 'Spanish Latte',
                'description' => 'No description for this product yet.',
                'price' => 95.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391130/products/spanish_latte-68fcb216757c3.png',
                'is_active' => 1,
            ],
            [
                'id' => 19,
                'category' => 'iced-coffee',
                'name' => 'Strawberry Matcha',
                'description' => 'No description for this product yet.',
                'price' => 2.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391166/products/starwberry_matcha-68fcb23c1d113.png',
                'is_active' => 1,
            ],
            [
                'id' => 20,
                'category' => 'iced-coffee',
                'name' => 'Macchiato',
                'description' => 'No description for this product yet.',
                'price' => 95.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391229/products/macchiato-68fcb274842b9.png',
                'is_active' => 1,
            ],
            [
                'id' => 21,
                'category' => 'iced-coffee',
                'name' => 'Cheesecake',
                'description' => 'No description for this product yet.',
                'price' => 89.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391266/products/cheesecake-68fcb2939bc35.png',
                'is_active' => 1,
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                ['id' => $product['id']],
                $product
            );
        }
    }
}
