<?php

declare(strict_types=1);

namespace App\Mail;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class HouseholdInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly Invitation $invitation) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "You've been invited to join a household",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.household-invitation',
            with: [
                'inviterName' => $this->invitation->invitedBy->name,
                'householdName' => $this->invitation->household->name,
                'acceptUrl' => rtrim(config('app.frontend_url'), '/').'/invitations/'.$this->invitation->token.'/accept',
                'declineUrl' => rtrim(config('app.frontend_url'), '/').'/invitations/'.$this->invitation->token.'/decline',
                'expiresAt' => $this->invitation->expires_at->format('d. m. Y'),
            ],
        );
    }

    /** @return array<int, \Illuminate\Mail\Mailables\Attachment> */
    public function attachments(): array
    {
        return [];
    }
}
