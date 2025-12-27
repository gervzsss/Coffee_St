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
                'description' => 'Bold espresso shots diluted with hot water, creating a rich and smooth coffee with a lighter body than straight espresso.',
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
                'description' => 'Classic Italian espresso drink with equal parts espresso, steamed milk, and thick milk foam, topped with a dusting of cocoa.',
                'price' => 110.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761326259/products/CAPUCCINO-68fbb4b1e30b3.png',
                'is_active' => 1,
            ],
            [
                'id' => 4,
                'category' => 'non-coffee',
                'name' => 'Raspeberry Tea',
                'description' => 'Refreshing blend of premium tea infused with natural raspberry flavor, served hot or iced for a fruity and aromatic experience.',
                'price' => 65.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761371183/products/Raspberry_tea-68fc6410c28b7.png',
                'is_active' => 1,
            ],
            [
                'id' => 5,
                'category' => 'frappe',
                'name' => 'Blueberry Frappe',
                'description' => 'Creamy blended frappe with sweet blueberry flavor, ice, and topped with whipped cream for a refreshing berry treat.',
                'price' => 120.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761371469/products/blueberry_frappe-5.png',
                'is_active' => 1,
            ],
            [
                'id' => 6,
                'category' => 'frappe',
                'name' => 'Choco Chip',
                'description' => 'Decadent chocolate frappe blended with chocolate chips, milk, and ice, topped with whipped cream and extra chocolate chips.',
                'price' => 135.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761371319/products/CHOCOCHIP-6.png',
                'is_active' => 1,
            ],
            [
                'id' => 7,
                'category' => 'frappe',
                'name' => 'Salted Caramel',
                'description' => 'Sweet and salty perfection with caramel sauce blended with coffee, milk, and ice, finished with whipped cream and caramel drizzle.',
                'price' => 135.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761372526/products/Salted_caramel-68fc696c94b25.png',
                'is_active' => 1,
            ],
            [
                'id' => 8,
                'category' => 'pastries',
                'name' => 'Cookie',
                'description' => 'Freshly baked chocolate chip cookie with a crispy edge and soft, chewy center loaded with premium chocolate chips.',
                'price' => 60.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761372699/products/cookies-68fc6a19aea84.png',
                'is_active' => 1,
            ],
            [
                'id' => 9,
                'category' => 'pastries',
                'name' => 'Red Velvet Cookie',
                'description' => 'Soft and chewy red velvet cookie with a hint of cocoa and cream cheese chips, perfectly sweet and indulgent.',
                'price' => 75.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761373153/products/RED_VELVE_COOKIES-68fc6bdec141c.png',
                'is_active' => 1,
            ],
            [
                'id' => 10,
                'category' => 'pastries',
                'name' => 'White Chocolate',
                'description' => 'Buttery cookie studded with premium white chocolate chips, baked to golden perfection with a melt-in-your-mouth texture.',
                'price' => 75.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761373257/products/white_chocolate-68fc6c47bbb70.png',
                'is_active' => 1,
            ],
            [
                'id' => 11,
                'category' => 'frappe',
                'name' => 'Ube Frappe',
                'description' => 'Filipino-inspired purple yam frappe blended with milk and ice, offering a unique nutty-sweet flavor topped with whipped cream.',
                'price' => 125.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761373632/products/UBE%20FRAPPE-68fc6dbe9ab9a.png',
                'is_active' => 1,
            ],
            [
                'id' => 12,
                'category' => 'frappe',
                'name' => 'Strawberry Frappe',
                'description' => 'Sweet strawberry flavor blended with creamy milk and ice, topped with whipped cream for a fruity and refreshing drink.',
                'price' => 120.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761373963/products/STRAWBEERY_FRAPPE-68fc6f0a39048.png',
                'is_active' => 1,
            ],
            [
                'id' => 13,
                'category' => 'frappe',
                'name' => 'Vanilla Latte',
                'description' => 'Smooth espresso combined with steamed milk and sweet vanilla syrup, creating a perfectly balanced and aromatic coffee drink.',
                'price' => 115.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761374132/products/VANILLA%20LATTE-68fc6f836ce0a.png',
                'is_active' => 1,
            ],
            [
                'id' => 14,
                'category' => 'hot-coffee',
                'name' => 'White Mocha',
                'description' => 'Rich espresso with white chocolate sauce and steamed milk, topped with whipped cream for a sweet and creamy indulgence.',
                'price' => 125.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761390498/products/white_mocha-68fcaf9fbd61c.png',
                'is_active' => 1,
            ],
            [
                'id' => 15,
                'category' => 'non-coffee',
                'name' => 'Lemon Tea',
                'description' => 'Bright and zesty tea infused with fresh lemon flavor, served hot or iced for a citrusy and revitalizing beverage.',
                'price' => 70.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761390642/products/lemon_tea-15.png',
                'is_active' => 1,
            ],
            [
                'id' => 16,
                'category' => 'iced-coffee',
                'name' => 'Matcha',
                'description' => 'Premium Japanese green tea powder whisked with milk, offering earthy and smooth flavors with natural caffeine and antioxidants.',
                'price' => 115.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391021/products/Matcha-68fcb1aa6c31c.png',
                'is_active' => 1,
            ],
            [
                'id' => 17,
                'category' => 'iced-coffee',
                'name' => 'Noir Mocha',
                'description' => 'Bold dark chocolate mocha with rich espresso and milk served over ice, perfect for dark chocolate lovers.',
                'price' => 125.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391081/products/Noir_Mocha-68fcb1e57225f.png',
                'is_active' => 1,
            ],
            [
                'id' => 18,
                'category' => 'iced-coffee',
                'name' => 'Spanish Latte',
                'description' => 'Smooth espresso with sweetened condensed milk over ice, creating a rich, creamy, and perfectly sweet coffee experience.',
                'price' => 120.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391130/products/spanish_latte-68fcb216757c3.png',
                'is_active' => 1,
            ],
            [
                'id' => 19,
                'category' => 'iced-coffee',
                'name' => 'Strawberry Matcha',
                'description' => 'Beautiful layered drink combining sweet strawberry flavor with earthy matcha green tea over milk and ice, creating a perfect balance.',
                'price' => 135.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391166/products/starwberry_matcha-68fcb23c1d113.png',
                'is_active' => 1,
            ],
            [
                'id' => 20,
                'category' => 'iced-coffee',
                'name' => 'Macchiato',
                'description' => 'Bold espresso marked with a dollop of frothy milk, served over ice for a strong coffee flavor with a smooth finish.',
                'price' => 110.00,
                'image_url' => 'https://res.cloudinary.com/dsfcry9re/image/upload/v1761391229/products/macchiato-68fcb274842b9.png',
                'is_active' => 1,
            ],
            [
                'id' => 21,
                'category' => 'iced-coffee',
                'name' => 'Cheesecake',
                'description' => 'Creamy cheesecake-flavored iced coffee blended with cream cheese and vanilla, topped with whipped cream for a dessert-like treat.',
                'price' => 125.00,
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
