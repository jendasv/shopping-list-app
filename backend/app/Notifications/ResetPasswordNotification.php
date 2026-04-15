<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends ResetPassword
{
    public function toMail(mixed $notifiable): MailMessage
    {
        $url = $this->resetUrl($notifiable);
        $expireMinutes = config('auth.passwords.'.config('auth.defaults.passwords').'.expire', 60);

        return (new MailMessage)
            ->subject(__('mail.reset_password.subject'))
            ->greeting(__('mail.reset_password.heading'))
            ->line(__('mail.reset_password.intro'))
            ->action(__('mail.reset_password.button'), $url)
            ->line(__('mail.reset_password.expiry', ['count' => $expireMinutes]))
            ->line(__('mail.reset_password.ignore'));
    }
}
