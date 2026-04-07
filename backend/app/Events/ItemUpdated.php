<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ItemUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        private readonly int $householdId,
        /** @var array<string, mixed> $data */
        private readonly array $data,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("household.{$this->householdId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ItemUpdated';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return $this->data;
    }
}
