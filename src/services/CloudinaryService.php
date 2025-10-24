<?php
declare(strict_types=1);

namespace App\Services;

class CloudinaryService
{
  /** @var mixed|null */
  private static $client = null;

  /**
   * @return mixed Cloudinary client instance
   */
  public static function getClient()
  {
    if (self::$client === null) {
      $cloudName = $_ENV['CLOUDINARY_CLOUD_NAME'] ?? '';
      $apiKey = $_ENV['CLOUDINARY_API_KEY'] ?? '';
      $apiSecret = $_ENV['CLOUDINARY_API_SECRET'] ?? '';

      if ($cloudName === '' || $apiKey === '' || $apiSecret === '') {
        throw new \RuntimeException('Cloudinary environment variables are not set.');
      }

      if (!class_exists('Cloudinary\\Cloudinary')) {
        throw new \RuntimeException('Cloudinary SDK not installed. Run composer require cloudinary/cloudinary_php');
      }

      self::$client = new \Cloudinary\Cloudinary([
        'cloud' => [
          'cloud_name' => $cloudName,
          'api_key' => $apiKey,
          'api_secret' => $apiSecret,
        ],
        'url' => [
          'secure' => true,
        ],
      ]);
    }
    return self::$client;
  }

  /**
   * Upload a local file path to Cloudinary under a folder.
   * @param string $filePath Temporary/local file path
   * @param array<string,mixed> $options Extra upload options (e.g., ['folder' => 'products'])
   * @return array{secure_url:string,public_id:string}
   */
  public static function upload(string $filePath, array $options = []): array
  {
    $client = self::getClient();
    $uploadOptions = array_merge(['folder' => 'products'], $options);
    $result = $client->uploadApi()->upload($filePath, $uploadOptions);
    return [
      'secure_url' => (string) ($result['secure_url'] ?? ''),
      'public_id' => (string) ($result['public_id'] ?? ''),
    ];
  }
}
