<?php

declare(strict_types=1);

namespace Tests\Unit\Mapper;

use App\Mapper\ItemMapper;
use App\Models\ListItem;
use PHPUnit\Framework\TestCase;

class ItemMapperTest extends TestCase
{
    private ItemMapper $mapper;

    protected function setUp(): void
    {
        $this->mapper = new ItemMapper;
    }

    public function test_maps_all_fields(): void
    {
        $item = new ListItem;
        $item->id = 1;
        $item->name = 'Milk';
        $item->quantity = 3;
        $item->is_completed = false;
        $item->list_id = 10;

        $result = $this->mapper->map($item);

        $this->assertSame(1, $result['id']);
        $this->assertSame('Milk', $result['name']);
        $this->assertEquals(3, $result['quantity']); // float cast: 3.0 == 3
        $this->assertFalse($result['isCompleted']);
        $this->assertSame(10, $result['listId']);
    }

    public function test_is_completed_is_cast_to_bool(): void
    {
        $item = new ListItem;
        $item->id = 1;
        $item->name = 'Eggs';
        $item->quantity = 1;
        $item->is_completed = 1;
        $item->list_id = 1;

        $result = $this->mapper->map($item);

        $this->assertIsBool($result['isCompleted']);
        $this->assertTrue($result['isCompleted']);
    }

    public function test_output_contains_expected_keys(): void
    {
        $item = new ListItem;
        $item->id = 1;
        $item->name = 'Bread';
        $item->quantity = 2;
        $item->is_completed = false;
        $item->list_id = 5;

        $result = $this->mapper->map($item);

        $this->assertArrayHasKey('id', $result);
        $this->assertArrayHasKey('name', $result);
        $this->assertArrayHasKey('quantity', $result);
        $this->assertArrayHasKey('isCompleted', $result);
        $this->assertArrayHasKey('listId', $result);
        $this->assertArrayHasKey('createdAt', $result);
        $this->assertArrayHasKey('updatedAt', $result);
    }
}
