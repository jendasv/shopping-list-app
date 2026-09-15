<?php

declare(strict_types=1);

namespace Tests\Unit\Service;

use App\Exceptions\Infrastructure\DatabaseOperationException;
use App\Service\ListService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_list_rolls_back_when_an_item_fails(): void
    {
        $user = $this->createUserWithHousehold();
        $service = app(ListService::class);

        try {
            $service->createList([
                'name' => 'Weekly Shopping',
                'items' => [
                    ['name' => 'Milk', 'quantity' => 1],
                    ['name' => '', 'quantity' => 1], // invalid — fails mid-loop
                ],
            ], $user);
            $this->fail('Expected DatabaseOperationException was not thrown.');
        } catch (DatabaseOperationException) {
            // expected
        }

        $this->assertDatabaseMissing('lists', ['name' => 'Weekly Shopping']);
        $this->assertDatabaseMissing('list_items', ['name' => 'Milk']);
    }
}
