<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['hot-coffee', 'iced-coffee', 'frappe', 'pastries', 'non-coffee'];
        
        return [
            'category' => fake()->randomElement($categories),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(15),
            'price' => fake()->randomFloat(2, 50, 500),
            'image_url' => fake()->imageUrl(640, 480, 'food', true),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the product is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
