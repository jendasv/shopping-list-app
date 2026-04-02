<x-mail::message>
# You've been invited

**{{ $inviterName }}** has invited you to join their household **{{ $householdName }}**.

<x-mail::button :url="$acceptUrl" color="primary">
Accept invitation
</x-mail::button>

Not interested? You can [decline the invitation]({{ $declineUrl }}).

This invitation expires on **{{ $expiresAt }}**.

Thanks,
{{ config('app.name') }}
</x-mail::message>
