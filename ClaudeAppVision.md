# App Vision — Household Lists

## Záměr produktu

Aplikace pro domácnosti, která sjednocuje sdílené listy do jednoho místa — nákupy, balení na cesty, a cokoliv dalšího co domácnost potřebuje společně řešit.

Cíl: **nemusíš přemýšlet.** App zná tvůj katalog položek, tvoje šablony a co potřebuješ. Ty jen potvrdíš a jdeš — nakoupit nebo zabalit.

---

## Cílový uživatel

Domácnosti (páry, rodiny) které:
- Nakupují pravidelně — potraviny, drogerie, vybavení, cokoliv
- Cestují spolu a řeší balení na cesty
- Plánují nákupy i výjezdy dopředu
- Chtějí sdílet listy v reálném čase
- Dnes to řeší papírem nebo poznámkami v telefonu

---

## Core use case

```
Žena přidává za chodu         Muž přidává za chodu
        ↓                              ↓
         ════════ sdílený seznam ════════
                      ↓
              Sednete si, projdete
                      ↓
              Jeden jde nakoupit
              Druhý vidí progress real-time
```

---

## Household workflow

### Každý uživatel má svůj household od registrace
```
Registrace → automaticky vznikne household "Honzova domácnost"
           → Honza je owner
           → všechny jeho listy patří tomuto household
```

### Sdílení (placená funkce)
```
Honza pozve Evu emailem (pouze Pro uživatel může pozvat)
  → Eva dostane email s odkazem
  → Eva vidí: "Honza tě zve do domácnosti"
  → Eva přijme → Evy shared listy → přesunou se do Honzova household
              → Evy private listy → přesunou se do Honzova household (Honza je neuvidí)
              → Evin vlastní household → is_active = false
              → Eva se přidá do Honzova household jako member

Eva odmítne → nic se nemění
```

### Odchod ze sdílené domácnosti
```
Eva odejde z Honzovy domácnosti
  → Private listy (created_by = Eva) → přesunou se do Eviného household
  → Shared listy (created_by = Eva)  → zůstanou v Honzově household
  → Evin vlastní household → is_active = true
  → Eva je zpět ve svém
```

### Pravidlo viditelnosti listů
```
Shared list → vidí všichni členové household
Private list → vidí jen tvůrce (created_by)
```

> *"Co bylo soukromé, jde se mnou. Co bylo sdílené, zůstane tam."*

---

## Centrální entita — Produktový katalog

Základ celého produktu. Místo volného textu obsahuje seznam **reference na produkty** z katalogu domácnosti.

```
Produktový katalog (domácnosti)
        │
        ├── má kategorii (Pečivo, Mléčné, Zelenina, Drogerie, Chemie, Elektro...)
        ├── má jednotku (ks, kg, l, ml...)
        └── je zdrojem pro:
                │
                ├── Nákupní seznam (instance produktu + množství)
                ├── Template (uložená skupina produktů — recept, balení, úklid...)
                └── Inventář (co máš doma)
```

### Tok dat — jak to funguje v praxi

```
Poprvé napíšeš "mouka"
  → vznikne položka v seznamu (volný text)
  → nabídne: "uložit do katalogu?"
  → uložíš, přiřadíš kategorii "Suché potraviny"

Poprvé napíšeš "toaletní papír"
  → stejný flow → kategorie "Drogerie"

Příště
  → píšeš "mo..." → našeptávač z katalogu (ať je to jídlo nebo drogerie)
  → vybereš, přidáš množství → okamžitě do seznamu

Šablona "Chleba" (volitelná funkce)
  → uložená skupina: mouka 500g, droždí 1ks, sůl 1ks
  → "Hey, dáme chleba!" → bum, tři položky najednou v seznamu

Šablona "Dovolená u moře"
  → uložená skupina: plavky, opalovací krém, ploutve...
  → přiřadíš k existujícímu listu nebo vytvoříš nový

Po nákupu
  → "Nákup dokončen" → potvrdíš
  → systém ví co jsi koupil a v jakém množství
  → inventář se aktualizuje automaticky
  → příště systém navrhne co dochází
```

---

## Datový model

```
User
├── is_super_admin (bool)
└── belongs to many → Households (přes household_user)

Household
├── name
├── is_active (bool) ← false = deaktivován (uživatel je v cizí domácnosti)
├── has many → Members (Users) přes household_user pivot
│       └── role (owner / member)
├── has many → Invitations
├── has many → Categories
├── has many → Products
├── has many → ShoppingLists
├── has many → Templates
└── has many → InventoryItems

Invitation
├── email, token, status (pending/accepted/expired), expires_at
├── belongs to → Household
└── invited_by → User

Category
└── name (Pečivo, Mléčné, Zelenina, Drogerie...)

Product (katalog domácnosti)
├── name, unit (ks/kg/l/ml...)
├── belongs to → Household
└── belongs to → Category

ShoppingList
├── belongs to → Household
├── created_by → User
├── status (active / completed)
├── visibility (shared / private)   ← shared = vidí všichni členové, private = jen tvůrce
└── has many → ShoppingListItems

ShoppingListItem
├── quantity
├── is_completed
├── belongs to → ShoppingList
└── belongs to → Product (nebo volný text jako fallback)

Template (šablona — recept, balení, úklid, cokoliv opakujícího se)
├── name, description
├── belongs to → Household
├── belongs to → TemplateCategory
└── has many → TemplateItems

TemplateCategory
└── name (Vaření / Cestování / Domácnost / Sport / ...)

TemplateItem
├── quantity
├── belongs to → Template
└── belongs to → Product

InventoryItem
├── quantity, updated_at
├── belongs to → Household
├── belongs to → Product
├── created_by → User
└── visibility (shared / private)   ← zdědí z listu při potvrzení nákupu
```

---

## Fáze vývoje

### Fáze 1 — Použitelné pro domácnost (základ)
Bez toho to nefunguje:
- [ ] Autentizace — registrace, login, reset hesla, ověření emailu
- [ ] Household — vytvoření, pozvání partnera emailem (invitation systém)
- [ ] Sdílený nákupní seznam s real-time sync (Laravel Reverb)
- [ ] Přidat / odškrtnout / smazat položku
- [ ] PWA — instalovatelné na telefon
- [ ] Zaškrtnutá položka se automaticky přesune na spodek seznamu (sort_order)

### Fáze 1.1 — Backend testy ✅ HOTOVO

**Infrastruktura**
- [x] `shopping_test` MySQL databáze, `phpunit.xml` přepnut z SQLite na MySQL
- [x] `TestCase` rozšířen o `spaPostJson()` a `createUserWithHousehold()` helpery

**Implementované testy (79 testů / 164 assertions)**
```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── RegisterTest.php         — 7 testů (registrace, household auto-vytvoření, validace)
│   │   ├── LoginTest.php            — 5 testů (správné/špatné heslo, validace)
│   │   └── LogoutTest.php           — 2 testy
│   ├── ShoppingList/
│   │   ├── ShoppingListCrudTest.php    — 7 testů (CRUD, list_user_order)
│   │   └── ShoppingListAccessTest.php  — 5 testů (cizí list = 404, shared/private viditelnost)
│   ├── Item/
│   │   ├── ItemCrudTest.php         — 7 testů (CRUD, validace, mark completed)
│   │   └── ItemAccessTest.php       — 5 testů (cizí list = 404, member může přidat)
│   ├── Household/
│   │   └── HouseholdTest.php        — 10 testů (show, rename, leave, přesun listů)
│   └── Invitation/
│       └── InvitationTest.php       — 13 testů (send, accept, decline, expiry, reuse)
└── Unit/
    ├── Mapper/
    │   ├── ItemMapperTest.php        — 3 testy (mapování polí, bool cast)
    │   └── ShoppingListMapperTest.php — 8 testů (listOnly, isOwner, sortOrder, items)
    └── Service/
        └── ItemServiceTest.php      — 5 testů (createItem validace, sort_order, reorder)
```

**Nalezené a opravené bugy při psaní testů**
- `is_active` chybělo v `fillable` na `Household` modelu → deaktivace household při přijetí pozvánky tiše selhávala

**Pravidlo pro další vývoj**
Při každé nové backend feature zvážit, zda přidat testy. Testy jsou nutné zejména pro:
- business logiku s více kroky (invitation flow, přesun listů, billing)
- access control (kdo má přístup k čemu)
- validaci dat na vstupu

Jednoduché CRUD bez logiky testovat není nutné.

**Do budoucna (souběžně s dalšími fázemi)**
- Policy/Authorization testy — owner vs member, superadmin (Fáze 2)
- Billing testy — Stripe webhook handlery, trial expiry (Fáze 9)

---

### Fáze 2 — Superadmin (Filament)
Správa systému přes **Filament admin panel** (`/admin`) — lepší mít od začátku než dodělávat zpětně.

**Technologie: Filament v3**
- Běží na `/admin`, odděleno od `/api`
- Auth přes `is_super_admin` flag na `User` modelu
- Instalace: `composer require filament/filament` + `php artisan filament:install --panels`
- Žádný extra Docker service — běží v PHP kontejneru

**Implementovat:**
- [ ] Instalace Filament, superadmin middleware
- [ ] Resource: Users — seznam, deaktivace, reset hesla, superadmin flag
- [ ] Resource: Households — název, owner, počet členů, is_active
- [ ] Resource: Shopping Lists — název, household, visibility, počet položek
- [ ] Resource: Invitations — status, email, expiry, možnost zrušit
- [ ] Dashboard widgety — počty uživatelů, listů, aktivní households

### Fáze 3 — Produktový katalog
Musí být před šablonami — vše ostatní stojí na katalogu:
- [ ] Produktový katalog domácnosti
- [ ] Kategorie produktů
- [ ] Vyhledávání / našeptávač při přidávání do seznamu
- [ ] Uložit položku ze seznamu do katalogu
- [ ] Přidat produkt z katalogu do seznamu

### Fáze 4 — Skupiny a štítky položek v seznamu
Obdoba skupin karet v Google Chrome — logické sekce uvnitř jednoho seznamu realizované přes štítky (labels):
- [ ] Štítek (Label) — předdefinovaný v rámci household, s názvem a barvou (např. "Osobní věci" 🔵, "Koupelna" 🟣, "Ovoce" 🟢, "Pekárna" 🟡)
- [ ] Položka může mít přiřazený štítek → vizuálně barevný border na levé straně + kurzivový nadpis skupiny
- [ ] Položky bez štítku tvoří výchozí skupinu
- [ ] Drag & drop položek mezi skupinami i uvnitř skupin
- [ ] Skupiny lze sbalit / rozbalit
- [ ] Použití: balení na cesty (sekce per osoba), nákup (sekce per oddělení supermarketu)

### Fáze 5 — Hromadné akce a řazení v seznamech
- [ ] Hromadný výběr položek (checkbox mode) — aktivuje se dlouhým stiskem nebo dedikovaným tlačítkem
- [ ] Hromadné mazání vybraných položek
- [ ] Hromadné přiřazení štítku / skupiny
- [ ] Hromadné označení jako splněno / nesplněno
- [ ] Řazení seznamu — podle názvu (A–Z), počtu kusů, stavu (splněno/nesplněno), vlastního pořadí (drag & drop)
- [ ] Řazení je dočasné (view preference) nebo trvalé — TBD

### Fáze 6 — Templates (šablony)

Šablony nahrazují původní koncept receptů — jsou obecnější:
- [ ] Template = pojmenovaná skupina produktů z katalogu
- [ ] Kategorie šablon (Vaření / Cestování / Domácnost / Sport / ...)
- [ ] Přidat šablonu do existujícího seznamu (batch přidání položek)
- [ ] Vytvořit nový seznam ze šablony
- [ ] Příklady: Chleba, Dovolená u moře, Horská turistika, Úklid bytu, Grilování...

### Fáze 7 — Inventář
- [ ] Potvrzení dokončeného nákupu
- [ ] Automatická aktualizace zásob po potvrzení
- [ ] Přehled co máš doma
- [ ] Návrhy co dochází při tvoření nového seznamu

### Fáze 8 — Notifikace
- [ ] In-app notifikace — oznámení o sdílení seznamu, přidání položky partnerem apod.

### Fáze 8.1 — Frontend testy (před nasazením)

Implementovat těsně před Fází 9 — když jsou core features stabilní a přicházejí platící uživatelé.

**Vitest — unit testy composables**
- `useShoppingLists` — fetch, create, delete, reorder
- `useListDetail` — optimistický update, live sync eventy
- `useContextMenu` — toggle, close
- `auth store` — fetchUser, login, logout

**Playwright — E2E kritické flows**
- Login → vytvoření listu → přidání položky → odškrtnutí
- Registrace → ověření emailu → první list
- Sdílení listu → live sync mezi dvěma uživateli

**Co netestovat**
- Vizuální styl (SVG přeškrtnutí, animace)
- Jednotlivé UI komponenty bez logiky

---

### Fáze 9 — Monetizace a růst
Filozofie: co nejvíc uživatelů za malou částku. Ne vysoký ticket, ale objem.
- [ ] Onboarding pro nové uživatele
- [ ] Štědrý free tier — uživatel musí zažít hodnotu než zaplatí
- [ ] Jeden jednoduchý placený plán (cca €2–4/měsíc) — žádné matoucí tabulky
- [ ] Stripe + Laravel Cashier
- [ ] Billing profil uživatele (fakturační údaje, UID-Nummer pro firmy)
- [ ] Stripe Tax — automatický výpočet MwSt/DPH podle země zákazníka
- [ ] Archivace faktur (7 let dle rakouského zákona)
- [ ] Nativní mobilní app (pokud bude zájem po validaci)


#### Daňové a právní poznámky (Rakousko)
- Podnikání registrováno v **Rakousku**
- **Nyní:** Kleinunternehmerregelung (do €35k obratu/rok) — faktury bez MwSt, žádný OSS, žádný Stripe Tax
- **Do budoucna:** Po překročení €35k zavést OSS schéma + Stripe Tax (automatický výpočet MwSt podle země zákazníka)
- Faktury archivovat **7 let**

#### Infrastruktura
- **Nyní:** Hetzner VPS (~€4/měsíc) — běží vše na jednom serveru (PHP, MySQL, Reverb), Resend pro emaily (free tier)
- **Do budoucna:** Škálování řešit až při potřebě (500+ aktivních uživatelů)

#### ⚠️ Před nasazením na produkci — Queue Worker
Broadcasting eventy (`ItemAdded`, `ItemUpdated`, `ItemDeleted`, `ListUpdated`) aktuálně používají `ShouldBroadcastNow` — broadcast se provede synchronně v rámci HTTP requestu (bez fronty).
Na produkci přepnout na `ShouldBroadcast` a spustit queue worker (`php artisan queue:work`).
To vyžaduje: supervisor nebo systemd service na VPS, nebo dedikovaný worker kontejner v Docker Compose.

---

## Aktuální struktura aplikace (Fáze 1)

### Backend — `backend/`

**Routing** `routes/api.php`
```
POST   /auth/register               AuthController@register
POST   /auth/login                  AuthController@login
POST   /auth/forgot-password        AuthController@forgotPassword
POST   /auth/reset-password         AuthController@resetPassword
--- auth:sanctum ---
POST   /auth/logout                 AuthController@logout
GET    /auth/user                   AuthController@user
PUT    /auth/profile                AuthController@updateProfile
PUT    /auth/password               AuthController@updatePassword
POST   /auth/email/resend           AuthController@resendVerification

GET    /household                   HouseholdController@show  → { ownHousehold, joinedHouseholds[] }
PUT    /household                   HouseholdController@update
POST   /household/{id}/leave        HouseholdController@leave

POST   /invitations                 InvitationController@send
POST   /invitations/{token}/accept  InvitationController@accept
POST   /invitations/{token}/decline InvitationController@decline

GET    /lists                       ShoppingListController@index
POST   /lists                       ShoppingListController@store
GET    /lists/{id}/items            ShoppingListController@show
PUT    /lists/{id}                  ShoppingListController@update
DELETE /lists/{id}                  ShoppingListController@destroy

POST   /lists/{id}/item             ItemController@store
GET    /lists/{id}/items/{itemId}   ItemController@show
PUT    /lists/{id}/items/{itemId}   ItemController@update
DELETE /lists/{id}/items/{itemId}   ItemController@destroy
```

**Vrstvy**
```
app/Http/Controllers/Api/   AuthController, HouseholdController, InvitationController
                            ShoppingListController, ItemController
app/Service/                ShoppingListService, ItemService
app/Mapper/                 ShoppingListMapper, ItemMapper, HouseholdMapper
app/Models/                 User, Household, Invitation, ShoppingList, Item
app/Events/                 ListUpdated, ItemAdded, ItemUpdated, ItemDeleted
app/Exceptions/Domain/      ResourceNotFoundException, ValidationException
app/Exceptions/Infrastructure/ DatabaseOperationException
```

**Databáze — klíčové FK kaskády**
```
users
  └─(owner_id)─► households ──CASCADE──► shopping_list ──CASCADE──► item
users ─CASCADE──► household_user (pivot: role owner/member)
users ─CASCADE──► invitations (invited_by)
households ─CASCADE──► invitations
shopping_list ─CASCADE──► item  (shopping_list_id)
```

---

### Frontend — `frontend/src/`

**Router** `router/index.ts`
```
/                   landing         (requiresGuest)
/login              login           (requiresGuest)
/forgot-password    forgot-password (requiresGuest)
/reset-password     reset-password  (requiresGuest)
/email-verify       email-verify
/email-verified     email-verified
/lists              home            (requiresAuth)
/lists/new          new-list        (requiresAuth)
/lists/:id          list-detail     (requiresAuth, beforeEnter: fetchList)
/household          household       (requiresAuth)
/settings           settings        (requiresAuth)
```
Router guard: neověřený email → přesměruj na `email-verify`

**Views** `views/`
```
auth/LandingView.vue        Typewrite animace, CTA
auth/LoginView.vue
auth/ForgotPasswordView.vue
auth/ResetPasswordView.vue
auth/EmailVerifyView.vue    resend + logout (přihlášený) / sign-in (nepřihlášený)
auth/EmailVerifiedView.vue
HomeView.vue                seznam listů
CreateShoppingList.vue
ListDetail.vue              položky listu, real-time sync
HouseholdView.vue           ownHousehold (edit, members, invite) + joinedHouseholds (leave)
SettingsView.vue            profil, heslo
```

**Services** `services/`
```
api.ts              apiFetch() — CSRF cookie + X-XSRF-TOKEN header, credentials: include
authService.ts      register, login, logout, getUser, forgotPassword, resetPassword,
                    updateProfile, updatePassword, resendVerification
householdService.ts getHousehold, updateHousehold, sendInvitation, leaveHousehold(id)
shoppingListService.ts fetchList, fetchLists, createList, updateList, deleteList
itemService.ts      (přímé volání v ListDetail.vue)
```

**Stores** `stores/`
```
auth.ts    user, loading, initialized, isAuthenticated, isEmailVerified
           fetchUser, login, register, logout
```

**Klíčové typy** `types/index.ts`
```
iUser, iHousehold, iHouseholdMember, iHouseholdOverview,
iItem, iShoppingList, iNewList
```

**Komponenty** `components/`
```
layout/AppHeader.vue          hlavičky s hamburger menu + user panel
layout/HamburgerMenu.vue      menu: My lists → Household → Settings
layout/UserPanel.vue          avatar dropdown
animations/Typewrite.vue      :text (jednou) | :texts[] (cyklicky s mazáním)
elements/AlertMessage.vue     type: success | error
elements/form/HandDrawnCheckbox.vue
form/AddItemForm.vue
```

---

## Vývojový proces

### Po každém kole změn — povinné kroky

Po každém balíku změn (ať frontend nebo backend) provést **code review a testy** před tím, než se pokračuje dál:

**Backend**
- `php artisan test` — spustit PHPUnit test suite (Feature + Unit testy proti MySQL `shopping_test` DB)
- `./vendor/bin/pint --test` — zkontrolovat formátování kódu
- `./vendor/bin/phpstan analyse` — statická analýza

**Frontend**
- `vue-tsc --build` — typová kontrola TypeScriptu
- `npm run lint` — ESLint + Oxlint

Vzor z optimalizace: kód se neodkládá do stavu "funguje, ale neotestovaný". Každý balík změn = otestovaný balík.

**Pravidlo pro testy při novém vývoji**
Při každé nové backend feature se vždy posoudí, zda jsou testy potřeba. Rozhoduje se případ od případu — není povinné testovat vše, ale je povinné se ptát.

---

## Technický stack

| Vrstva | Technologie |
|--------|-------------|
| Backend | Laravel 13, PHP 8.3 |
| Auth | Laravel Sanctum |
| Real-time | Laravel Reverb (WebSockets) |
| Frontend | Vue 3, TypeScript, Tailwind CSS |
| Mobile | PWA (fáze 1), nativní app later |
| Databáze | MySQL 8 |
| Billing | Laravel Cashier + Stripe |
| Superadmin | vlastní middleware + admin sekce |

---

## Co aplikace není

- Není jen o potravinách — jde o veškeré nákupy domácnosti
- Není nutriční tracker
- Není recipe scraper z URL
- Není sociální síť
- Šablony jsou feature, ne core — app funguje bez nich
- Recepty neexistují jako samostatná feature — jsou součástí šablon

## Diferenciátor

Ostatní appky jsou **pasivní** — otevřeš, napíšeš, zavřeš.

Tato app je **aktivní** — zná tvůj katalog produktů, tvoje šablony, co máš doma. Nákupní seznam se z části sestaví sám.

---

*Vize sestavena: 2026-03-31*
