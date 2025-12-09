#!/usr/bin/env php
<?php

/**
 * Midtrans Configuration Checker
 * 
 * Script ini untuk mengecek apakah konfigurasi Midtrans sudah benar
 */

echo "\n";
echo "==============================================\n";
echo "  MIDTRANS CONFIGURATION CHECKER\n";
echo "==============================================\n\n";

// Load .env file
$envFile = __DIR__ . '/.env';

if (!file_exists($envFile)) {
    echo "❌ File .env tidak ditemukan!\n";
    echo "   Lokasi: $envFile\n\n";
    exit(1);
}

$envContent = file_get_contents($envFile);

// Check for Midtrans keys
$hasServerKey = preg_match('/MIDTRANS_SERVER_KEY=(.+)/', $envContent, $serverKeyMatch);
$hasClientKey = preg_match('/MIDTRANS_CLIENT_KEY=(.+)/', $envContent, $clientKeyMatch);

echo "Checking configuration...\n\n";

// Server Key
if ($hasServerKey && !empty(trim($serverKeyMatch[1]))) {
    $serverKey = trim($serverKeyMatch[1]);
    if (strpos($serverKey, 'SB-Mid-server-') === 0) {
        echo "✅ MIDTRANS_SERVER_KEY: Configured (Sandbox)\n";
        echo "   Value: " . substr($serverKey, 0, 20) . "...\n";
    } elseif (strpos($serverKey, 'Mid-server-') === 0) {
        echo "✅ MIDTRANS_SERVER_KEY: Configured (Production)\n";
        echo "   Value: " . substr($serverKey, 0, 20) . "...\n";
    } else {
        echo "⚠️  MIDTRANS_SERVER_KEY: Invalid format\n";
        echo "   Expected: SB-Mid-server-... (Sandbox) or Mid-server-... (Production)\n";
        echo "   Got: $serverKey\n";
    }
} else {
    echo "❌ MIDTRANS_SERVER_KEY: Not configured or empty\n";
    echo "   Please add to .env file\n";
}

echo "\n";

// Client Key
if ($hasClientKey && !empty(trim($clientKeyMatch[1]))) {
    $clientKey = trim($clientKeyMatch[1]);
    if (strpos($clientKey, 'SB-Mid-client-') === 0) {
        echo "✅ MIDTRANS_CLIENT_KEY: Configured (Sandbox)\n";
        echo "   Value: " . substr($clientKey, 0, 20) . "...\n";
    } elseif (strpos($clientKey, 'Mid-client-') === 0) {
        echo "✅ MIDTRANS_CLIENT_KEY: Configured (Production)\n";
        echo "   Value: " . substr($clientKey, 0, 20) . "...\n";
    } else {
        echo "⚠️  MIDTRANS_CLIENT_KEY: Invalid format\n";
        echo "   Expected: SB-Mid-client-... (Sandbox) or Mid-client-... (Production)\n";
        echo "   Got: $clientKey\n";
    }
} else {
    echo "❌ MIDTRANS_CLIENT_KEY: Not configured or empty\n";
    echo "   Please add to .env file\n";
}

echo "\n";

// Other settings
$isProduction = preg_match('/MIDTRANS_IS_PRODUCTION=(.+)/', $envContent, $prodMatch);
if ($isProduction) {
    $prodValue = trim($prodMatch[1]);
    echo "ℹ️  MIDTRANS_IS_PRODUCTION: $prodValue\n";
    if ($prodValue === 'false') {
        echo "   (Sandbox mode - for testing)\n";
    } else {
        echo "   (Production mode - live transactions)\n";
    }
}

echo "\n";
echo "==============================================\n";
echo "  NEXT STEPS\n";
echo "==============================================\n\n";

if (!$hasServerKey || !$hasClientKey || 
    empty(trim($serverKeyMatch[1] ?? '')) || 
    empty(trim($clientKeyMatch[1] ?? ''))) {
    
    echo "1. Login to https://dashboard.midtrans.com/\n";
    echo "2. Go to Settings → Access Keys\n";
    echo "3. Select 'Sandbox' tab\n";
    echo "4. Copy Server Key and Client Key\n";
    echo "5. Add to .env file:\n\n";
    echo "   MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx\n";
    echo "   MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx\n\n";
    echo "6. Run: php artisan config:clear\n";
    echo "7. Try payment again\n\n";
} else {
    echo "✅ Configuration looks good!\n\n";
    echo "If you still get errors:\n";
    echo "1. Run: php artisan config:clear\n";
    echo "2. Restart Laravel server\n";
    echo "3. Clear browser cache\n";
    echo "4. Try payment again\n\n";
}

echo "==============================================\n\n";
