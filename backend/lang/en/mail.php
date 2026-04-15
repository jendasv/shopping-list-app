<?php

declare(strict_types=1);

return [

    'footer' => [
        'rights' => 'All rights reserved.',
    ],

    'invitation' => [
        'subject' => "You've been invited to join a household",
        'heading' => "You've been invited",
        'intro' => '**:inviter** has invited you to join their household **:household**.',
        'button' => 'Accept invitation',
        'decline' => 'Not interested? You can [decline the invitation](:url).',
        'expires' => 'This invitation expires on **:date**.',
        'thanks' => 'Thanks,',
    ],

    'verify_email' => [
        'subject' => 'Verify Your Email Address',
        'heading' => 'Verify Email Address',
        'intro' => 'Please click the button below to verify your email address.',
        'button' => 'Verify Email Address',
        'expiry' => 'This verification link will expire in :count minutes.',
        'ignore' => 'If you did not create an account, no further action is required.',
    ],

    'reset_password' => [
        'subject' => 'Reset Password Notification',
        'heading' => 'Reset Password Notification',
        'intro' => 'You are receiving this email because we received a password reset request for your account.',
        'button' => 'Reset Password',
        'expiry' => 'This password reset link will expire in :count minutes.',
        'ignore' => 'If you did not request a password reset, no further action is required.',
    ],

];
