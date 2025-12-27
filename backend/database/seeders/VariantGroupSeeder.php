<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariantGroup;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class VariantGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing variant groups to prevent duplicates
        $this->command->info('Clearing existing variant groups...');

        // Delete all existing variant groups and their variants
        ProductVariant::whereNotNull('variant_group_id')->delete();
        ProductVariantGroup::query()->delete();

        $this->command->info('Seeding fresh variant groups...');

        // Hot Coffee Drinks
        $hotCoffeeDrinks = Product::whereIn('name', ['Americano', 'White Mocha'])->get();
        foreach ($hotCoffeeDrinks as $drink) {
            $this->seedHotCoffeeVariants($drink);
        }

        // Iced Coffee Drinks
        $icedCoffeeDrinks = Product::whereIn('name', ['Cappuccino', 'Spanish Latte', 'Matcha', 'Noir Mocha', 'Strawberry Matcha', 'Macchiato', 'Cheesecake'])->get();
        foreach ($icedCoffeeDrinks as $drink) {
            $this->seedIcedCoffeeVariants($drink);
        }

        // Frappes
        $frappes = Product::whereIn('name', ['Blueberry Frappe', 'Choco Chip', 'Salted Caramel', 'Ube Frappe', 'Strawberry Frappe', 'Vanilla Latte'])->get();
        foreach ($frappes as $frappe) {
            $this->seedFrappeVariants($frappe);
        }

        // Tea Drinks
        $teaDrinks = Product::whereIn('name', ['Raspeberry Tea', 'Lemon Tea'])->get();
        foreach ($teaDrinks as $tea) {
            $this->seedTeaVariants($tea);
        }

        // Pastries
        $pastries = Product::whereIn('name', ['Cinnamon Roll', 'Cookie', 'Red Velvet Cookie', 'White Chocolate'])->get();
        foreach ($pastries as $pastry) {
            $this->seedPastryVariants($pastry);
        }

        $this->command->info('Variant groups seeded successfully!');
    }

    private function seedHotCoffeeVariants($product)
    {
        // Size Group
        $sizeGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Size',
            'description' => 'Choose your cup size',
            'selection_type' => 'single',
            'is_required' => true,
            'display_order' => 1,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Small (8oz)',
            'price_delta' => -10,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Medium (12oz)',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Large (16oz)',
            'price_delta' => 20,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Milk Type Group
        $milkGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Milk Type',
            'description' => 'Select your preferred milk',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 2,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $milkGroup->id,
            'group_name' => 'Milk Type',
            'name' => 'Whole Milk',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $milkGroup->id,
            'group_name' => 'Milk Type',
            'name' => 'Oat Milk',
            'price_delta' => 20,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $milkGroup->id,
            'group_name' => 'Milk Type',
            'name' => 'Almond Milk',
            'price_delta' => 20,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $milkGroup->id,
            'group_name' => 'Milk Type',
            'name' => 'Soy Milk',
            'price_delta' => 15,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $milkGroup->id,
            'group_name' => 'Milk Type',
            'name' => 'Skim Milk',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Sweetness Level
        $sweetnessGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Sweetness Level',
            'description' => 'Adjust the sweetness',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 3,
            'is_active' => true,
        ]);

        foreach (['0%', '25%', '50%', '75%', '100%'] as $level) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $sweetnessGroup->id,
                'group_name' => 'Sweetness Level',
                'name' => $level,
                'price_delta' => 0,
                'is_active' => true,
                'is_default' => $level === '100%',
            ]);
        }

        // Espresso Shots
        $shotsGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Espresso Shots',
            'description' => 'Customize coffee strength',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 4,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $shotsGroup->id,
            'group_name' => 'Espresso Shots',
            'name' => 'Regular (2 shots)',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $shotsGroup->id,
            'group_name' => 'Espresso Shots',
            'name' => 'Extra Shot (+1)',
            'price_delta' => 25,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $shotsGroup->id,
            'group_name' => 'Espresso Shots',
            'name' => 'Double Extra (+2)',
            'price_delta' => 45,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Add-Ons
        $addOnsGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Add-Ons',
            'description' => 'Enhance your drink',
            'selection_type' => 'multiple',
            'is_required' => false,
            'display_order' => 5,
            'is_active' => true,
        ]);

        $addOns = [
            ['name' => 'Whipped Cream', 'price' => 15],
            ['name' => 'Vanilla Syrup', 'price' => 15],
            ['name' => 'Caramel Drizzle', 'price' => 15],
            ['name' => 'Chocolate Syrup', 'price' => 15],
            ['name' => 'Cinnamon Powder', 'price' => 5],
        ];

        foreach ($addOns as $addOn) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $addOnsGroup->id,
                'group_name' => 'Add-Ons',
                'name' => $addOn['name'],
                'price_delta' => $addOn['price'],
                'is_active' => true,
                'is_default' => false,
            ]);
        }
    }

    private function seedIcedCoffeeVariants($product)
    {
        // Size Group
        $sizeGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Size',
            'description' => 'Choose your cup size',
            'selection_type' => 'single',
            'is_required' => true,
            'display_order' => 1,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Small (12oz)',
            'price_delta' => -15,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Medium (16oz)',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Large (22oz)',
            'price_delta' => 25,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Milk Type
        $milkGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Milk Type',
            'description' => 'Select your preferred milk',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 2,
            'is_active' => true,
        ]);

        $milkTypes = [
            ['name' => 'Whole Milk', 'price' => 0, 'default' => true],
            ['name' => 'Oat Milk', 'price' => 20, 'default' => false],
            ['name' => 'Almond Milk', 'price' => 20, 'default' => false],
            ['name' => 'Soy Milk', 'price' => 15, 'default' => false],
            ['name' => 'Coconut Milk', 'price' => 20, 'default' => false],
            ['name' => 'Skim Milk', 'price' => 0, 'default' => false],
        ];

        foreach ($milkTypes as $milk) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $milkGroup->id,
                'group_name' => 'Milk Type',
                'name' => $milk['name'],
                'price_delta' => $milk['price'],
                'is_active' => true,
                'is_default' => $milk['default'],
            ]);
        }

        // Ice Level
        $iceGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Ice Level',
            'description' => 'How much ice would you like?',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 3,
            'is_active' => true,
        ]);

        $iceLevels = ['No Ice', 'Light Ice', 'Regular Ice', 'Extra Ice'];
        foreach ($iceLevels as $index => $level) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $iceGroup->id,
                'group_name' => 'Ice Level',
                'name' => $level,
                'price_delta' => 0,
                'is_active' => true,
                'is_default' => $level === 'Regular Ice',
            ]);
        }

        // Sweetness Level
        $sweetnessGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Sweetness Level',
            'description' => 'Adjust the sweetness',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 4,
            'is_active' => true,
        ]);

        foreach (['0%', '25%', '50%', '75%', '100%'] as $level) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $sweetnessGroup->id,
                'group_name' => 'Sweetness Level',
                'name' => $level,
                'price_delta' => 0,
                'is_active' => true,
                'is_default' => $level === '100%',
            ]);
        }

        // Espresso Shots
        $shotsGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Espresso Shots',
            'description' => 'Boost your caffeine',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 5,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $shotsGroup->id,
            'group_name' => 'Espresso Shots',
            'name' => 'Regular (2 shots)',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $shotsGroup->id,
            'group_name' => 'Espresso Shots',
            'name' => 'Extra Shot (+1)',
            'price_delta' => 25,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $shotsGroup->id,
            'group_name' => 'Espresso Shots',
            'name' => 'Double Extra (+2)',
            'price_delta' => 45,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Toppings
        $toppingsGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Toppings',
            'description' => 'Add delicious toppings',
            'selection_type' => 'multiple',
            'is_required' => false,
            'display_order' => 6,
            'is_active' => true,
        ]);

        $toppings = [
            ['name' => 'Whipped Cream', 'price' => 15],
            ['name' => 'Vanilla Syrup Pump', 'price' => 10],
            ['name' => 'Caramel Drizzle', 'price' => 15],
            ['name' => 'Chocolate Chips', 'price' => 20],
            ['name' => 'Cookie Crumbles', 'price' => 20],
        ];

        foreach ($toppings as $topping) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $toppingsGroup->id,
                'group_name' => 'Toppings',
                'name' => $topping['name'],
                'price_delta' => $topping['price'],
                'is_active' => true,
                'is_default' => false,
            ]);
        }
    }

    private function seedFrappeVariants($product)
    {
        // Size Group
        $sizeGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Size',
            'description' => 'Choose your cup size',
            'selection_type' => 'single',
            'is_required' => true,
            'display_order' => 1,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Regular (16oz)',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Large (22oz)',
            'price_delta' => 30,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Milk Base
        $milkGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Milk Base',
            'description' => 'Select your milk base',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 2,
            'is_active' => true,
        ]);

        $milkTypes = [
            ['name' => 'Whole Milk', 'price' => 0, 'default' => true],
            ['name' => 'Oat Milk', 'price' => 25, 'default' => false],
            ['name' => 'Almond Milk', 'price' => 25, 'default' => false],
            ['name' => 'Coconut Milk', 'price' => 25, 'default' => false],
        ];

        foreach ($milkTypes as $milk) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $milkGroup->id,
                'group_name' => 'Milk Base',
                'name' => $milk['name'],
                'price_delta' => $milk['price'],
                'is_active' => true,
                'is_default' => $milk['default'],
            ]);
        }

        // Sweetness Level
        $sweetnessGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Sweetness Level',
            'description' => 'Adjust the sweetness',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 3,
            'is_active' => true,
        ]);

        foreach (['0%', '25%', '50%', '75%', '100%'] as $level) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $sweetnessGroup->id,
                'group_name' => 'Sweetness Level',
                'name' => $level,
                'price_delta' => 0,
                'is_active' => true,
                'is_default' => $level === '100%',
            ]);
        }

        // Toppings
        $toppingsGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Toppings',
            'description' => 'Customize with delicious toppings',
            'selection_type' => 'multiple',
            'is_required' => false,
            'display_order' => 4,
            'is_active' => true,
        ]);

        $toppings = [
            ['name' => 'Extra Whipped Cream', 'price' => 15],
            ['name' => 'Chocolate Drizzle', 'price' => 15],
            ['name' => 'Caramel Drizzle', 'price' => 15],
            ['name' => 'Cookie Crumbles', 'price' => 20],
            ['name' => 'Chocolate Chips', 'price' => 20],
            ['name' => 'Marshmallows', 'price' => 15],
            ['name' => 'Sprinkles', 'price' => 10],
        ];

        foreach ($toppings as $topping) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $toppingsGroup->id,
                'group_name' => 'Toppings',
                'name' => $topping['name'],
                'price_delta' => $topping['price'],
                'is_active' => true,
                'is_default' => false,
            ]);
        }

        // Add-Ons (for coffee-based frappes)
        if (in_array($product->name, ['Vanilla Latte', 'Choco Chip', 'Salted Caramel'])) {
            $addOnsGroup = ProductVariantGroup::create([
                'product_id' => $product->id,
                'name' => 'Coffee Add-Ons',
                'description' => 'Enhance your frappe',
                'selection_type' => 'multiple',
                'is_required' => false,
                'display_order' => 5,
                'is_active' => true,
            ]);

            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $addOnsGroup->id,
                'group_name' => 'Coffee Add-Ons',
                'name' => 'Extra Espresso Shot',
                'price_delta' => 30,
                'is_active' => true,
                'is_default' => false,
            ]);

            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $addOnsGroup->id,
                'group_name' => 'Coffee Add-Ons',
                'name' => 'Java Chips',
                'price_delta' => 25,
                'is_active' => true,
                'is_default' => false,
            ]);
        }
    }

    private function seedTeaVariants($product)
    {
        // Size Group
        $sizeGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Size',
            'description' => 'Choose your cup size',
            'selection_type' => 'single',
            'is_required' => true,
            'display_order' => 1,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Small (12oz)',
            'price_delta' => -10,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Medium (16oz)',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sizeGroup->id,
            'group_name' => 'Size',
            'name' => 'Large (22oz)',
            'price_delta' => 20,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Ice Level
        $iceGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Ice Level',
            'description' => 'How much ice would you like?',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 2,
            'is_active' => true,
        ]);

        $iceLevels = ['No Ice', 'Light Ice', 'Regular Ice', 'Extra Ice'];
        foreach ($iceLevels as $level) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $iceGroup->id,
                'group_name' => 'Ice Level',
                'name' => $level,
                'price_delta' => 0,
                'is_active' => true,
                'is_default' => $level === 'Regular Ice',
            ]);
        }

        // Sweetness Level
        $sweetnessGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Sweetness Level',
            'description' => 'Adjust the sweetness',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 3,
            'is_active' => true,
        ]);

        foreach (['0%', '25%', '50%', '75%', '100%'] as $level) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $sweetnessGroup->id,
                'group_name' => 'Sweetness Level',
                'name' => $level,
                'price_delta' => 0,
                'is_active' => true,
                'is_default' => $level === '100%',
            ]);
        }

        // Add-Ons
        $addOnsGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Add-Ons',
            'description' => 'Enhance your tea',
            'selection_type' => 'multiple',
            'is_required' => false,
            'display_order' => 4,
            'is_active' => true,
        ]);

        $addOns = [
            ['name' => 'Popping Boba (Lychee)', 'price' => 20],
            ['name' => 'Popping Boba (Strawberry)', 'price' => 20],
            ['name' => 'Honey', 'price' => 10],
            ['name' => 'Fresh Lemon', 'price' => 15],
            ['name' => 'Mint Leaves', 'price' => 10],
        ];

        foreach ($addOns as $addOn) {
            ProductVariant::create([
                'product_id' => $product->id,
                'variant_group_id' => $addOnsGroup->id,
                'group_name' => 'Add-Ons',
                'name' => $addOn['name'],
                'price_delta' => $addOn['price'],
                'is_active' => true,
                'is_default' => false,
            ]);
        }
    }

    private function seedPastryVariants($product)
    {
        // Quantity Options
        $quantityGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Quantity',
            'description' => 'How many would you like?',
            'selection_type' => 'single',
            'is_required' => true,
            'display_order' => 1,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $quantityGroup->id,
            'group_name' => 'Quantity',
            'name' => 'Single',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $quantityGroup->id,
            'group_name' => 'Quantity',
            'name' => 'Box of 3',
            'price_delta' => 35,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $quantityGroup->id,
            'group_name' => 'Quantity',
            'name' => 'Box of 6',
            'price_delta' => 60,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Serving Options
        $servingGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Serving Preference',
            'description' => 'How would you like it served?',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 2,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $servingGroup->id,
            'group_name' => 'Serving Preference',
            'name' => 'Room Temperature',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $servingGroup->id,
            'group_name' => 'Serving Preference',
            'name' => 'Warmed',
            'price_delta' => 10,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Add-Ons (only for certain pastries)
        if (in_array($product->name, ['Cinnamon Roll', 'Cookie', 'Red Velvet Cookie'])) {
            $addOnsGroup = ProductVariantGroup::create([
                'product_id' => $product->id,
                'name' => 'Add-Ons',
                'description' => 'Make it extra special',
                'selection_type' => 'multiple',
                'is_required' => false,
                'display_order' => 3,
                'is_active' => true,
            ]);

            $addOns = [
                ['name' => 'Extra Cream Cheese Frosting', 'price' => 15],
                ['name' => 'Chocolate Drizzle', 'price' => 10],
                ['name' => 'Caramel Sauce', 'price' => 10],
            ];

            foreach ($addOns as $addOn) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'variant_group_id' => $addOnsGroup->id,
                    'group_name' => 'Add-Ons',
                    'name' => $addOn['name'],
                    'price_delta' => $addOn['price'],
                    'is_active' => true,
                    'is_default' => false,
                ]);
            }
        }
    }
}
