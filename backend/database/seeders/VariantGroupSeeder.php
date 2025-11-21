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
        
        // Delete variant groups for products we're about to seed
        $productNames = ['Americano', 'Cappuccino', 'Raspeberry Tea'];
        $productIds = Product::whereIn('name', $productNames)->pluck('id');
        
        // Delete associated data first
        ProductVariant::whereIn('product_id', $productIds)
            ->whereNotNull('variant_group_id')
            ->delete();
            
        ProductVariantGroup::whereIn('product_id', $productIds)->delete();
        
        $this->command->info('Seeding fresh variant groups...');

        // Find Americano product
        $americano = Product::where('name', 'Americano')->first();
        if ($americano) {
            $this->seedAmericanoVariants($americano);
        }

        // Find Cappuccino product
        $cappuccino = Product::where('name', 'Cappuccino')->first();
        if ($cappuccino) {
            $this->seedCappuccinoVariants($cappuccino);
        }

        // Find Raspberry Tea product
        $raspberryTea = Product::where('name', 'Raspeberry Tea')->first();
        if ($raspberryTea) {
            $this->seedRaspberryTeaVariants($raspberryTea);
        }
        
        $this->command->info('Variant groups seeded successfully!');
    }

    private function seedAmericanoVariants($product)
    {
        // Temperature Group
        $tempGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Temperature',
            'description' => 'Choose your preferred temperature',
            'selection_type' => 'single',
            'is_required' => true,
            'display_order' => 1,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $tempGroup->id,
            'group_name' => 'Temperature',
            'name' => 'Hot',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $tempGroup->id,
            'group_name' => 'Temperature',
            'name' => 'Iced',
            'price_delta' => 10,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Sweetness Group
        $sweetnessGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Sweetness',
            'description' => 'Adjust the sweetness level',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 2,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sweetnessGroup->id,
            'group_name' => 'Sweetness',
            'name' => 'No Sugar',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sweetnessGroup->id,
            'group_name' => 'Sweetness',
            'name' => '25% Sweet',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sweetnessGroup->id,
            'group_name' => 'Sweetness',
            'name' => '50% Sweet',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sweetnessGroup->id,
            'group_name' => 'Sweetness',
            'name' => '75% Sweet',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $sweetnessGroup->id,
            'group_name' => 'Sweetness',
            'name' => '100% Sweet',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Ice Level Group
        $iceGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Ice Level',
            'description' => 'Select ice amount for iced drinks',
            'selection_type' => 'single',
            'is_required' => false,
            'display_order' => 3,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $iceGroup->id,
            'group_name' => 'Ice Level',
            'name' => 'No Ice',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $iceGroup->id,
            'group_name' => 'Ice Level',
            'name' => 'Less Ice',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $iceGroup->id,
            'group_name' => 'Ice Level',
            'name' => 'Regular Ice',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $iceGroup->id,
            'group_name' => 'Ice Level',
            'name' => 'Extra Ice',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Add Ons Group
        $addOnsGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Add Ons',
            'description' => 'Enhance your drink with extras',
            'selection_type' => 'multiple',
            'is_required' => false,
            'display_order' => 4,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $addOnsGroup->id,
            'group_name' => 'Add Ons',
            'name' => 'Extra Shot',
            'price_delta' => 30,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $addOnsGroup->id,
            'group_name' => 'Add Ons',
            'name' => 'Whipped Cream',
            'price_delta' => 20,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $addOnsGroup->id,
            'group_name' => 'Add Ons',
            'name' => 'Caramel Drizzle',
            'price_delta' => 15,
            'is_active' => true,
            'is_default' => false,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $addOnsGroup->id,
            'group_name' => 'Add Ons',
            'name' => 'Chocolate Syrup',
            'price_delta' => 15,
            'is_active' => true,
            'is_default' => false,
        ]);
    }

    private function seedCappuccinoVariants($product)
    {
        // Temperature Group
        $tempGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Temperature',
            'selection_type' => 'single',
            'is_required' => true,
            'display_order' => 1,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $tempGroup->id,
            'group_name' => 'Temperature',
            'name' => 'Hot',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $tempGroup->id,
            'group_name' => 'Temperature',
            'name' => 'Iced',
            'price_delta' => 10,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Add Ons Group
        $addOnsGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Add Ons',
            'selection_type' => 'multiple',
            'is_required' => false,
            'display_order' => 2,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $addOnsGroup->id,
            'group_name' => 'Add Ons',
            'name' => 'Extra Shot',
            'price_delta' => 30,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $addOnsGroup->id,
            'group_name' => 'Add Ons',
            'name' => 'Vanilla Syrup',
            'price_delta' => 20,
            'is_active' => true,
        ]);
    }

    private function seedRaspberryTeaVariants($product)
    {
        // Ice Level Group (required for tea)
        $iceGroup = ProductVariantGroup::create([
            'product_id' => $product->id,
            'name' => 'Ice Level',
            'description' => 'This drink is served iced only',
            'selection_type' => 'single',
            'is_required' => true,
            'display_order' => 1,
            'is_active' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $iceGroup->id,
            'group_name' => 'Ice Level',
            'name' => 'Regular Ice',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => true,
        ]);

        ProductVariant::create([
            'product_id' => $product->id,
            'variant_group_id' => $iceGroup->id,
            'group_name' => 'Ice Level',
            'name' => 'Less Ice',
            'price_delta' => 0,
            'is_active' => true,
            'is_default' => false,
        ]);
    }
}
