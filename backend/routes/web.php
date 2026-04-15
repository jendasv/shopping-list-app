<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Email verification — link z emailu, uživatel nemusí být přihlášen (SPA flow)
Route::get('/email/verify/{id}/{hash}', function (Request $request, string $id, string $hash) {
    $user = User::findOrFail($id);

    if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
        abort(403, 'Invalid verification link.');
    }

    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Verified($user));
    }

    return redirect(config('app.frontend_url').'/email-verified');
})->middleware(['signed'])->name('verification.verify');

Route::get('/admin/locale/{locale}', function (string $locale) {
    if (in_array($locale, config('locales'))) {
        auth()->user()->forceFill(['locale' => $locale])->save();
    }

    return redirect()->back();
})->middleware(['auth', 'web'])->name('admin.locale');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link sent.']);
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');
