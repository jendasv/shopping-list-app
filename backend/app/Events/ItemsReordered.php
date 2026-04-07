<?php

declare(strict_types=1);

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ItemsReordered implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        private readonly int $householdId,
        private readonly int $listId,
        /** @var array<int, int> $order */
        private readonly array $order,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("household.{$this->householdId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'ItemsReordered';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        return [
            'listId' => $this->listId,
            'order' => $this->order,
        ];
    }
}
