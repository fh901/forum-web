<?php

return [
    'name'     => env('APP_NAME', 'Salon Web ENSA'),
    'env'      => env('APP_ENV', 'local'),
    'debug'    => (bool) env('APP_DEBUG', true),
    'url'      => env('APP_URL', 'http://localhost'),
    'locale'   => 'fr',
    'fallback_locale' => 'fr',
    'faker_locale'    => 'fr_FR',
    'cipher'   => 'AES-256-CBC',
    'key'      => env('APP_KEY'),
    'previous_keys' => array_filter(explode(',', env('APP_PREVIOUS_KEYS', ''))),
    'maintenance' => ['driver' => env('APP_MAINTENANCE_DRIVER', 'file')],
    'providers' => Illuminate\Support\AggregateServiceProvider::defaultProviders()->toArray(),
    'aliases'   => Illuminate\Support\Facades\Facade::defaultAliases()->toArray(),
    App\Providers\RouteServiceProvider::class,
];
