<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'price' => $product->price,
                'description' => $product->description,
                'image_url' => $product->image_url,
                'is_available' => $product->is_active,
                'stock' => null, // Add stock field if you have inventory
            ];
        });

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:160',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:50',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'category' => $validated['category'],
            'image_url' => $validated['image_url'] ?? null,
            'is_active' => $validated['is_available'] ?? true,
        ]);

        return response()->json($product, 201);
    }

    public function show($id)
    {
        $product = Product::findOrFail($id);
        
        return response()->json([
            'id' => $product->id,
            'name' => $product->name,
            'category' => $product->category,
            'price' => $product->price,
            'description' => $product->description,
            'image_url' => $product->image_url,
            'is_available' => $product->is_active,
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:160',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string|max:50',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
        ]);

        $updateData = [];
        if (isset($validated['name'])) $updateData['name'] = $validated['name'];
        if (isset($validated['description'])) $updateData['description'] = $validated['description'];
        if (isset($validated['price'])) $updateData['price'] = $validated['price'];
        if (isset($validated['category'])) $updateData['category'] = $validated['category'];
        if (isset($validated['image_url'])) $updateData['image_url'] = $validated['image_url'];
        if (isset($validated['is_available'])) $updateData['is_active'] = $validated['is_available'];

        $product->update($updateData);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }
}
