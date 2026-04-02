<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Household channel — jen členové household mají přístup
Broadcast::channel('household.{householdId}', function ($user, $householdId) {
    return $user->households()->where('households.id', $householdId)->exists();
});
