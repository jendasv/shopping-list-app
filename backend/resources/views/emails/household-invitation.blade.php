<x-mail::message>
# {{ __('mail.invitation.heading') }}

{{ __('mail.invitation.intro', ['inviter' => $inviterName, 'household' => $householdName]) }}

<x-mail::button :url="$acceptUrl" color="primary">
{{ __('mail.invitation.button') }}
</x-mail::button>

{{ __('mail.invitation.decline', ['url' => $declineUrl]) }}

{{ __('mail.invitation.expires', ['date' => $expiresAt]) }}

{{ __('mail.invitation.thanks') }}
{{ config('app.name') }}
</x-mail::message>
