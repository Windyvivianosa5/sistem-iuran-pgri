<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans Server Key
    |--------------------------------------------------------------------------
    |
    | Your Midtrans server key from dashboard
    |
    */
    'server_key' => env('MIDTRANS_SERVER_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Midtrans Client Key
    |--------------------------------------------------------------------------
    |
    | Your Midtrans client key from dashboard
    |
    */
    'client_key' => env('MIDTRANS_CLIENT_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Midtrans Production Mode
    |--------------------------------------------------------------------------
    |
    | Set to true for production environment, false for sandbox
    |
    */
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),

    /*
    |--------------------------------------------------------------------------
    | Midtrans Sanitization
    |--------------------------------------------------------------------------
    |
    | Enable/disable input sanitization
    |
    */
    'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),

    /*
    |--------------------------------------------------------------------------
    | Midtrans 3DS
    |--------------------------------------------------------------------------
    |
    | Enable/disable 3D Secure
    |
    */
    'is_3ds' => env('MIDTRANS_IS_3DS', true),
];
