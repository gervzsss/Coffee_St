<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all products
     */
    public function index(Request $request)
    {
        $query = Product::where('is_active', true)
            ->with(['activeVariants', 'activeVariantGroups.activeVariants']);
        
        // Filter by category if provided
        if ($request->has('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }
        
        // Search by name if provided
        if ($request->has('search') && $request->search !== '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        
        $products = $query->get();
        return response()->json($products);
    }

    /**
     * Get single product
     */
    public function show($id)
    {
        $product = Product::with(['activeVariants', 'activeVariantGroups.activeVariants'])->find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        
        return response()->json($product);
    }

    /**
     * Get variant groups for a specific product
     */
    public function variantGroups($id)
    {
        $product = Product::with(['activeVariantGroups.activeVariants' => function ($query) {
            $query->orderBy('name');
        }])->find($id);
        
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        
        return response()->json([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'variant_groups' => $product->activeVariantGroups,
        ]);
    }
}
