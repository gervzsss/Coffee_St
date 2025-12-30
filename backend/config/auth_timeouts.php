<?php

return [

  /*
  |--------------------------------------------------------------------------
  | User Authentication Timeout Settings
  |--------------------------------------------------------------------------
  |
  | These values control the idle timeout and maximum lifetime for
  | authenticated user sessions (customer accounts).
  |
  */

  'user' => [
    // Idle timeout in minutes - user will be logged out after this period of inactivity
    'idle_timeout_minutes' => env('AUTH_IDLE_TIMEOUT_MINUTES_USER', 30),

    // Maximum session lifetime in minutes (optional, null to disable)
    'max_lifetime_minutes' => env('AUTH_MAX_LIFETIME_MINUTES_USER', null),
  ],

  /*
  |--------------------------------------------------------------------------
  | Admin Authentication Timeout Settings
  |--------------------------------------------------------------------------
  |
  | These values control the idle timeout and maximum lifetime for
  | admin sessions. Admin sessions typically have stricter timeouts.
  |
  */

  'admin' => [
    // Idle timeout in minutes - admin will be logged out after this period of inactivity
    'idle_timeout_minutes' => env('AUTH_IDLE_TIMEOUT_MINUTES_ADMIN', 60),

    // Maximum session lifetime in minutes (optional, null to disable)
    'max_lifetime_minutes' => env('AUTH_MAX_LIFETIME_MINUTES_ADMIN', null),
  ],

];
