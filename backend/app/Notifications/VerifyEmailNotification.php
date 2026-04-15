<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailNotification extends VerifyEmail
{
    public function toMail(mixed $notifiable): MailMessage
    {
        $url = $this->verificationUrl($notifiable);
        $expireMinutes = config('auth.verification.expire', 60);

        return (new MailMessage)
            ->subject(__('mail.verify_email.subject'))
            ->greeting(__('mail.verify_email.heading'))
            ->line(__('mail.verify_email.intro'))
            ->action(__('mail.verify_email.button'), $url)
            ->line(__('mail.verify_email.expiry', ['count' => $expireMinutes]))
            ->line(__('mail.verify_email.ignore'));
    }
}
