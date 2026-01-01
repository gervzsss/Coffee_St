<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        try {
            $file = $request->file('image');

            $cloudName = config('cloudinary.cloud_name');
            $apiKey = config('cloudinary.api_key');
            $apiSecret = config('cloudinary.api_secret');

            if (! $cloudName || ! $apiKey || ! $apiSecret) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cloudinary configuration is missing',
                ], 500);
            }

            $timestamp = time();
            $folder = 'coffee_st/products';

            // Build string to sign (must be in alphabetical order)
            $stringToSign = "folder={$folder}&timestamp={$timestamp}".$apiSecret;
            $signature = sha1($stringToSign);

            $response = Http::withoutVerifying()->attach(
                'file',
                file_get_contents($file->getRealPath()),
                $file->getClientOriginalName()
            )->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/upload", [
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
                'folder' => $folder,
            ]);

            if ($response->successful()) {
                $result = $response->json();

                return response()->json([
                    'success' => true,
                    'url' => $result['secure_url'],
                    'public_id' => $result['public_id'],
                ]);
            }

            Log::error('Cloudinary upload failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload image to Cloudinary',
            ], 500);

        } catch (\Exception $e) {
            Log::error('Image upload error: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while uploading the image',
            ], 500);
        }
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'public_id' => 'required|string',
        ]);

        try {
            $cloudName = config('cloudinary.cloud_name');
            $apiKey = config('cloudinary.api_key');
            $apiSecret = config('cloudinary.api_secret');

            if (! $cloudName || ! $apiKey || ! $apiSecret) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cloudinary configuration is missing',
                ], 500);
            }

            $timestamp = time();
            $publicId = $request->input('public_id');

            // Build string to sign (must be in alphabetical order)
            $stringToSign = "public_id={$publicId}&timestamp={$timestamp}".$apiSecret;
            $signature = sha1($stringToSign);

            $response = Http::withoutVerifying()->post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                'api_key' => $apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
                'public_id' => $publicId,
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Image deleted successfully',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image from Cloudinary',
            ], 500);

        } catch (\Exception $e) {
            Log::error('Image delete error: '.$e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the image',
            ], 500);
        }
    }
}
