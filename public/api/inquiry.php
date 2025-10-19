<?php
// public/api/inquiry.php

require_once __DIR__ . '/../../src/config/bootstrap.php';
require_once __DIR__ . '/../../src/helpers/common.php';
require_once __DIR__ . '/../../src/repositories/repositories.php';
use App\Repositories\InquiryRepository;
use function App\Helpers\db;
use function App\Helpers\current_user;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}


$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$subject = trim((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

$userId = null;
$userEmail = null;
$userName = null;

$user = current_user();
if ($user && isset($user['id'])) {
    $userId = (int) $user['id'];
    $userEmail = trim((string) ($user['email'] ?? ''));
    $userName = trim(sprintf('%s %s', $user['first_name'] ?? '', $user['last_name'] ?? ''));
}

$errors = [];
if ($userId === null && $name === '') {
    $errors['name'] = 'Name is required.';
}

$emailToValidate = $userId !== null ? ($userEmail !== '' ? $userEmail : $email) : $email;
if (!filter_var($emailToValidate, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Valid email is required.';
}

if ($subject === '') {
    $errors['subject'] = 'Subject is required.';
}

if ($message === '') {
    $errors['message'] = 'Message is required.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['errors' => $errors]);
    exit;
}

$guestEmail = null;
$guestName = null;
if ($userId === null) {
    $guestEmail = strtolower($emailToValidate);
    $guestName = $name !== '' ? $name : 'Guest';
}

$senderName = ($userId !== null)
    ? ($userName !== '' ? $userName : 'User')
    : ($name !== '' ? $name : 'Guest');
$senderEmail = $userId !== null ? ($userEmail !== '' ? $userEmail : $emailToValidate) : $emailToValidate;

try {
    $repo = new InquiryRepository(db());
    $thread = $repo->submitInquiry(
        $userId,
        $guestEmail,
        $guestName,
        $subject,
        $message,
        $senderName,
        $senderEmail,
    );

    echo json_encode([
        'success' => true,
        'thread_id' => $thread['id'] ?? null,
        'status' => $thread['status'] ?? 'pending',
    ]);
} catch (\InvalidArgumentException $e) {
    http_response_code(422);
    echo json_encode(['error' => $e->getMessage()]);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to submit inquiry.']);
}
