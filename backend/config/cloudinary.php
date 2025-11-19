<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Here are each of the Cloudinary configuration variables for your application.
    | Most of them are optional, but some may be required depending on your usage.
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),
    'secure' => env('CLOUDINARY_SECURE', true),
    'base_url' => env('CLOUDINARY_BASE_URL', 'https://res.cloudinary.com'),
];
