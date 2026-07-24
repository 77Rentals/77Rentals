<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// macondo-private/ sits two levels above this file's folder (macondo/), as a
// sibling of the webroot (public/ locally, or your domain's document root on
// DreamHost) — it must NEVER be inside a folder that gets served over HTTP:
//   Local dev:   public/macondo/chat.php        + macondo-private/config.php
//   DreamHost:   ~/yourdomain.com/macondo/chat.php + ~/macondo-private/config.php
$privateDir = dirname(__DIR__, 2) . '/macondo-private';
$configPath = $privateDir . '/config.php';
$contextPath = $privateDir . '/system-prompt.json';

if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server misconfigured: missing config.php']);
    exit;
}
require $configPath; // defines ANTHROPIC_API_KEY

if (!defined('ANTHROPIC_API_KEY') || ANTHROPIC_API_KEY === '' || strpos(ANTHROPIC_API_KEY, 'REPLACE') !== false) {
    http_response_code(500);
    echo json_encode(['error' => 'Server misconfigured: API key not set']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data) || empty($data['message']) || !is_string($data['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing message']);
    exit;
}

$message = trim($data['message']);
if ($message === '' || mb_strlen($message) > 2000) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid message']);
    exit;
}

$lang = (isset($data['lang']) && $data['lang'] === 'en') ? 'en' : 'es';

$context = [];
if (is_file($contextPath)) {
    $context = json_decode((string) file_get_contents($contextPath), true) ?: [];
}

$baseInstructions = $context['instructions'] ?? 'You are a helpful assistant for a vacation rental.';
$propertyInfo = $context[$lang]['property'] ?? '';
$tourismInfo = $context[$lang]['tourism'] ?? '';

$languageNote = $lang === 'en'
    ? 'Always reply in English, regardless of the language used elsewhere in this prompt.'
    : 'Responde siempre en espanol, sin importar el idioma usado en el resto de este mensaje.';

$systemPrompt = trim(
    $baseInstructions . "\n\n" . $languageNote .
    "\n\n### Property / check-in info\n" . $propertyInfo .
    "\n\n### Local tourism info\n" . $tourismInfo
);

// Optional short rolling history sent by the widget: [{role, content}, ...]
$messages = [];
if (!empty($data['history']) && is_array($data['history'])) {
    foreach (array_slice($data['history'], -6) as $turn) {
        if (
            isset($turn['role'], $turn['content']) &&
            in_array($turn['role'], ['user', 'assistant'], true) &&
            is_string($turn['content'])
        ) {
            $messages[] = [
                'role' => $turn['role'],
                'content' => mb_substr($turn['content'], 0, 2000),
            ];
        }
    }
}
$messages[] = ['role' => 'user', 'content' => $message];

$payload = json_encode([
    'model' => 'claude-haiku-4-5',
    'max_tokens' => 500,
    'system' => $systemPrompt,
    'messages' => $messages,
]);

if ($payload === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to build request']);
    exit;
}

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        'content-type: application/json',
        'x-api-key: ' . ANTHROPIC_API_KEY,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_TIMEOUT => 25,
    CURLOPT_CONNECTTIMEOUT => 10,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErrNo = curl_errno($ch);
curl_close($ch);

if ($response === false || $curlErrNo !== 0) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not reach the AI service. Please try again.']);
    exit;
}

$decoded = json_decode($response, true);

if ($httpCode !== 200 || !isset($decoded['content'][0]['text'])) {
    http_response_code(502);
    echo json_encode(['error' => 'Unexpected response from the AI service.']);
    exit;
}

echo json_encode(['reply' => $decoded['content'][0]['text']]);
