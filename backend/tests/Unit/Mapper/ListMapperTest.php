<?php

declare(strict_types=1);

namespace Tests\Unit\Mapper;

use App\Mapper\ItemMapper;
use App\Mapper\ListMapper;
use App\Models\ListItem;
use App\Models\Liste;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use PHPUnit\Framework\TestCase;

class ListMapperTest extends TestCase
{
    private ListMapper $mapper;

    protected function setUp(): void
    {
        $this->mapper = new ListMapper(new ItemMapper);
    }

    private function makeList(string $name = 'Test List', string $visibility = 'shared'): Liste
    {
        $list = new Liste;
        $list->id = 1;
        $list->name = $name;
        $list->list_type = 'shopping';
        $list->status = 'active';
        $list->visibility = $visibility;
        $list->created_by = 1;
        $list->setRelation('items', new Collection);

        return $list;
    }

    public function test_maps_basic_fields(): void
    {
        $list = $this->makeList('Weekly Shopping', 'shared');

        $result = $this->mapper->map($list);

        $this->assertSame(1, $result['id']);
        $this->assertSame('Weekly Shopping', $result['name']);
        $this->assertSame('shared', $result['visibility']);
        $this->assertSame('shopping', $result['listType']);
        $this->assertSame('active', $result['status']);
    }

    public function test_items_are_included_by_default(): void
    {
        $list = $this->makeList();

        $result = $this->mapper->map($list);

        $this->assertArrayHasKey('items', $result);
        $this->assertIsArray($result['items']);
    }

    public function test_items_are_excluded_when_list_only(): void
    {
        $list = $this->makeList();

        $result = $this->mapper->map($list, listOnly: true);

        $this->assertArrayNotHasKey('items', $result);
    }

    public function test_is_owner_is_true_when_user_is_creator(): void
    {
        $list = $this->makeList();
        $list->created_by = 42;

        $user = new User;
        $user->id = 42;

        $result = $this->mapper->map($list, user: $user);

        $this->assertTrue($result['isOwner']);
    }

    public function test_is_owner_is_false_when_user_is_not_creator(): void
    {
        $list = $this->makeList();
        $list->created_by = 1;

        $user = new User;
        $user->id = 99;

        $result = $this->mapper->map($list, user: $user);

        $this->assertFalse($result['isOwner']);
    }

    public function test_is_owner_is_null_when_no_user_provided(): void
    {
        $list = $this->makeList();

        $result = $this->mapper->map($list);

        $this->assertNull($result['isOwner']);
    }

    public function test_sort_order_is_mapped_when_set(): void
    {
        $list = $this->makeList();
        $list->user_sort_order = 3;

        $result = $this->mapper->map($list);

        $this->assertSame(3, $result['sortOrder']);
    }

    public function test_items_are_mapped_correctly(): void
    {
        $item = new ListItem;
        $item->id = 5;
        $item->name = 'Butter';
        $item->quantity = 1;
        $item->is_completed = false;
        $item->list_id = 1;

        $list = $this->makeList();
        $list->setRelation('items', new Collection([$item]));

        $result = $this->mapper->map($list);

        $this->assertCount(1, $result['items']);
        $this->assertSame('Butter', $result['items'][0]['name']);
    }
}
