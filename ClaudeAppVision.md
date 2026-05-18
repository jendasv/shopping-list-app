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
────────────────────────────────────────────
  GLOBÁLNÍ LOOKUP TABULKY (sdílené, seedované)
────────────────────────────────────────────

Languages
├── id
├── code          (en, cs, de, sk, pl, fr...)
├── name_native   (English, Čeština, Deutsch...)
├── is_active     (bool — nasazené jazyky)
└── flag_emoji    (🇬🇧, 🇨🇿, 🇩🇪...)

Units
├── id
├── symbol        (g, kg, ml, l, ks, bal, lžíce, lžička...)
└── type          (weight, volume, count, piece)

UnitTranslations
├── unit_id       (FK → units)
├── lang_id       (FK → languages)
└── value         (gram, kilogram, mililitr, litr, kus...)

GlobalProducts  ← crowdsourced + Open Food/Beauty/Products/PetFood Facts
├── id
├── household_id  (nullable — null = globální; set = viditelné jen dané domácnosti)
├── barcode       (EAN-13, UPC-A, QR...)
├── name
├── brand         (nullable)
├── default_category_id (nullable, FK → global category)
├── default_unit_id     (nullable, FK → units)
├── image_url     (nullable)
├── source        (enum: user | open_food_facts | open_beauty_facts | open_products_facts | open_pet_food_facts | admin)
├── verified      (bool — admin ověřil)
├── scan_count    (int — kolik domácností potvrdilo produkt)
└── created_at

────────────────────────────────────────────
  HOUSEHOLD ENTIY
────────────────────────────────────────────

User
├── is_super_admin (bool)
└── belongs to many → Households (přes household_user)

Household
├── name
├── is_active (bool) ← false = deaktivován (uživatel je v cizí domácnosti)
├── has many → Members (Users) přes household_user pivot
│       └── role (owner / member)
├── has many → Invitations
├── has many → Categories (vlastní kategorie domácnosti)
├── has many → Products (katalog domácnosti)
├── has many → Lists
├── has many → Templates
└── has many → InventoryItems

Invitation
├── email, token, status (pending/accepted/expired), expires_at
├── belongs to → Household
└── invited_by → User

────────────────────────────────────────────
  KATEGORIE (globální i household vlastní)
────────────────────────────────────────────

Category
├── id
├── household_id  (nullable — null = globální)
├── is_global     (bool)
├── name          (nullable — pouze pro custom household kategorie)
└── sort_order

CategoryTranslations  ← pouze pro globální kategorie
├── category_id   (FK → categories)
├── lang_id       (FK → languages)
└── value         (Pečivo, Bakery, Bäckerei...)

Logika překladu:
  is_global = true  → název z CategoryTranslations podle uživatelova jazyka
  is_global = false → název přímo z category.name (user ho vytvořil ve svém jazyce)

────────────────────────────────────────────
  PRODUKTOVÝ KATALOG DOMÁCNOSTI
────────────────────────────────────────────

Product
├── household_id
├── global_product_id   (nullable — FK → GlobalProducts; napojení na knihovnu)
├── category_id         (FK → categories)
├── name                (může přepsat název z global_product)
├── barcode             (nullable — pokud není napojeno na global_product)
├── preferred_unit_id   (FK → units)
├── preferred_quantity  (decimal, nullable)
└── notes               (brand preference, obchod, "jen bio", "červené víčko"...)

────────────────────────────────────────────
  LISTY A POLOŽKY
────────────────────────────────────────────

List  (dříve ShoppingList)
├── household_id
├── created_by → User
├── list_type   (enum: shopping, packing, todo)
├── name
├── status      (active / completed / archived)
├── visibility  (shared / private)
└── has many → ListItems

ListItem  (dříve ShoppingListItem)
├── list_id
├── product_id  (nullable — FK → products; odkaz na katalog domácnosti)
├── name        (nullable — free text fallback; pokud product_id, použij produkt.name)
├── quantity    (decimal, nullable — null pro todo položky)
├── unit_id     (nullable, FK → units)
├── is_completed
├── sort_order
└── notes       (nullable)

────────────────────────────────────────────
  ŠABLONY & RECEPTY
────────────────────────────────────────────

TemplateCategory  ← household-specific, bez překladů
├── id
├── household_id
└── name          (Vaření / Cestování / Domácnost / Sport...)

Template
├── household_id
├── created_by → User
├── template_type    (enum: generic, recipe)
├── template_category_id (nullable, FK → TemplateCategory)
├── name, description
├── default_servings (int, nullable — jen pro template_type = recipe)
└── has many → TemplateItems

TemplateItem
├── template_id
├── product_id  (nullable — FK → products)
├── name        (nullable — free text fallback)
├── quantity    (decimal, nullable)
└── unit_id     (nullable, FK → units)

────────────────────────────────────────────
  INVENTÁŘ
────────────────────────────────────────────

InventoryItem
├── household_id
├── product_id     (FK → products)
├── created_by → User
├── quantity
├── min_quantity   (nullable — minimální hranice; při poklesu auto-add do příštího listu)
├── updated_at
└── visibility     (shared / private — zdědí z listu při potvrzení nákupu)
```

### Překladový pattern — HasTranslations trait

Pro `Unit` a globální `Category` vlastní Eloquent trait `HasTranslations`:
- `withTranslation(string $langCode)` scope — JOIN přes `*_translations` + `languages`
- Fallback na `en` pokud překlad chybí
- Žádná externí závislost, ~30 řádků

### Barcode scanning — strategie (implementováno ve Fázi 3)

**BarcodeScanner.vue state machine:**
```
scanning (kamera aktivní)
  │  ↓ uživatel klikne "Zadat číslo ručně"
  │  └→ manualInput (textový vstup, numeric keyboard)
  │
  ↓ kamera detekuje čárový kód
searching (API call — PROBÍHÁ UVNITŘ SCANNERU)
  │
  ├── GET /global-products/search?barcode=
  │   ├── 1. Hledej v global_products (vlastní DB, okamžité)
  │   │       → nalezeno (household nebo globální) → scan_count++
  │   │
  │   └── 2. Nenalezeno → Http::pool() — 4 databáze PARALELNĚ (max 5s):
  │           ├── world.openfoodfacts.org   (potraviny)
  │           ├── world.openbeautyfacts.org (kosmetika, drogerie)
  │           ├── world.openproductsfacts.org (spotřební věci)
  │           └── world.openpetfoodfacts.org  (krmivo)
  │           → první úspěšná odpověď → ulož do global_products → zobraz
  │
  ├── Nalezeno → emit productFound(iGlobalProduct)
  │   → AddItemForm předvyplní formulář (name + brand), scanner se zavře
  │
  └── Nenalezeno → stav notFound
        Uživatel má 3 možnosti:
        ├── "Skenovat znovu" → zpět na scanning
        ├── "Zadat číslo ručně" → manualInput
        └── "Pokračovat bez názvu produktu" → emit barcodeOnly(barcode)
            → AddItemForm: scannedBarcode ref se nastaví, hint "Čárový kód připojen"
            → uživatel zadá název → po submit: storeUserProduct() na pozadí
            → uloží do global_products (source: user, household_id: X)
            → viditelné pouze dané domácnosti (dokud admin nepovýší na globální)
```

**manualInput flow:** uživatel zadá číslo → stejný searching flow jako po scanu.

**Emitované eventy z BarcodeScanner:**
- `productFound(product: iGlobalProduct)` — produkt nalezen, formulář se předvyplní
- `barcodeOnly(barcode: string)` — produkt nenalezen, uživatel pokračuje ručně
- `close` — scanner zavřen

**Moderace uživatelských příspěvků (pending — task #7):**
Produkty s `source='user'` zůstávají household-scoped — ostatní domácnosti je nevidí.
Globální viditelnost vyžaduje admin review přes Filament. Claude API moderace názvů
zvážit až při automatickém povyšování do globální DB.

**Technologie:** `@zxing/browser` (BrowserMultiFormatReader).
**HTTPS požadavek:** `navigator.mediaDevices.getUserMedia` vyžaduje secure context.
**iOS:** funguje pouze v Safari (iOS Chrome/WKWebView camera API nepodporuje).
**Dev HTTPS:** mkcert certifikáty v `docker/certs/`, Vite config čte z `/app/certs/`.
**Mobilní přístup:** Windows portproxy (5173, 8080, 6001) → WSL2; certifikát instalovat jako CA.

---

## Fáze vývoje

### Fáze 1 — Použitelné pro domácnost (základ) ✅ HOTOVO
Bez toho to nefunguje:
- [x] Autentizace — registrace, login, reset hesla, ověření emailu
- [x] Household — vytvoření, pozvání partnera emailem (invitation systém)
- [x] Sdílený nákupní seznam s real-time sync (Laravel Reverb)
- [x] Přidat / odškrtnout / smazat položku
- [x] PWA — instalovatelné na telefon
- [x] Zaškrtnutá položka se automaticky přesune na spodek seznamu (sort_order)

### Fáze 1.1 — Backend testy ✅ HOTOVO

**Infrastruktura**
- [x] `shopping_test` PostgreSQL databáze, `phpunit.xml` přepnut z SQLite na PostgreSQL
- [x] `TestCase` rozšířen o `spaPostJson()` a `createUserWithHousehold()` helpery

**Implementované testy**
```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── RegisterTest.php         — 7 testů (registrace, household auto-vytvoření, validace)
│   │   ├── LoginTest.php            — 5 testů (správné/špatné heslo, validace)
│   │   └── LogoutTest.php           — 2 testy
│   ├── List/
│   │   ├── ListCrudTest.php         — 7 testů (CRUD, list_user_order)
│   │   └── ListAccessTest.php       — 5 testů (cizí list = 404, shared/private viditelnost)
│   ├── Item/
│   │   ├── ItemCrudTest.php         — 7 testů (CRUD, validace, mark completed)
│   │   └── ItemAccessTest.php       — 5 testů (cizí list = 404, member může přidat)
│   ├── Household/
│   │   └── HouseholdTest.php        — 14 testů (show, rename, leave, přesun listů, removeMember)
│   └── Invitation/
│       └── InvitationTest.php       — 13 testů (send, accept, decline, expiry, reuse)
└── Unit/
    ├── Mapper/
    │   ├── ItemMapperTest.php        — 3 testy (mapování polí, bool cast)
    │   └── ListMapperTest.php        — 8 testů (listOnly, isOwner, sortOrder, items)
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

### Fáze 2 — Superadmin (Filament) ✅ HOTOVO

Správa systému přes **Filament admin panel** (`/admin`) — lepší mít od začátku než dodělávat zpětně.

**Technologie: Filament v4** (v3 nekompatibilní s Laravel 13)
- Běží na `/admin`, odděleno od `/api`
- Auth přes `is_super_admin` flag na `User` modelu (implementuje `FilamentUser`)
- Pouze superadmini mají přístup (`canAccessPanel()`)
- Žádný extra Docker service — běží v PHP kontejneru

**Hotovo:**
- [x] Instalace Filament v4, superadmin middleware (`canAccessPanel`)
- [x] Resource: Users — seznam, deaktivace (`is_active`), superadmin flag, edit hesla
- [x] Resource: Households — název, owner name, počet členů, is_active
- [x] Resource: Shopping Lists — název, household, creator, visibility badge, počet položek
- [x] Dashboard widget — StatsOverview: počty uživatelů, aktivních households, listů
- [x] Artisan příkaz `admin:create {email}` — povýší existujícího nebo vytvoří nového superadmina
- [x] Migrace `is_active` na tabulce `users`

**Přístup k panelu:** `http://localhost:8080/admin`
**Vytvoření/povýšení superadmina:**
```bash
docker compose exec php php artisan admin:create email@example.com
```

- [x] Resource: Invitations — status, email, expiry, možnost zrušit (Revoke akce)

### Fáze 2.1 — Lokalizace ✅ HOTOVO

Podporované jazyky: `['en', 'cs']` — definováno v `config/locales.php`.
Locale uložené na `users.locale` (nullable, fallback `'en'`).

**Architektura překladu — kde co žije:**
```
lang/
├── en/mail.php     ← emaily (PHP pole, dot-notation klíče: mail.invitation.subject)
├── cs/mail.php     ← emaily CZ
├── cs.json         ← admin (JSON, klíč = EN string: "Active" → "Aktivní")
```
Frontend překládá Vue composable `vue-i18n` — soubory v `frontend/src/locales/`.

**Emaily**
- `lang/{en,cs}/mail.php` — překlady pro 3 typy emailů: pozvánka, ověření emailu, reset hesla
- Locale se bere z `User->preferredLocale()` — implementuje `HasLocalePreference`
- `Mail::to($user)` → locale se nastaví automaticky z uživatele
- Vlastní `VerifyEmailNotification` + `ResetPasswordNotification` (rozšiřují Laravel třídy, přepisují `toMail()`)
- Blade šablona pozvánky: `resources/views/emails/household-invitation.blade.php`
- Email vendor views: `resources/views/vendor/mail/html/` (header, button, layout, message)

**Admin (Filament v4)**
- `lang/cs.json` — překlady všech labelů (sloupce, filtry, sekce, widgety)
- `SetLocaleFromUser` middleware zaregistrován v `AdminPanelProvider` — nastaví locale z přihlášeného uživatele
- Language switcher v user menu (vpravo nahoře) — zobrazí jazyky kromě aktivního, uloží přes `GET /admin/locale/{locale}`
- Všechny Resources mají `getModelLabel()` + `getPluralModelLabel()` přes `__()`

**Frontend**
- `vue-i18n`, soubory v `frontend/src/locales/`
- Přepínač jazyka: `LocaleSwitcher.vue` v UI

### Fáze 2.2 — Refactor: List types + přejmenování ✅ HOTOVO
- [x] Migrace: `shopping_list` → `lists`, `item` → `list_items`
- [x] `list_type` (enum: shopping/packing/todo) + `status` (active/completed/archived) na `lists`
- [x] `unit_id` (nullable), `notes` (nullable), `quantity` decimal na `list_items`
- [x] Modely: `ShoppingList` (PHP si vyhrazuje `List`) → `Liste`, `Item` → `ListItem`; staré jako deprecated aliasy
- [x] Tabulky: `languages`, `units`, `unit_translations`, `categories`, `category_translations`, `global_products`
- [x] Seedery: 6 jazyků, 17 jednotek (EN/CS), 20 globálních kategorií (EN/CS)
- [x] Frontend: výběr `list_type` při vytváření seznamu

### Fáze 2.3 — API security ✅ HOTOVO
- [x] Rate limiting: `throttle:auth` (10/min) na auth endpointy, `throttle:api` (120/min) globálně
- [x] Email verification: `verified` middleware na protected routes; accept/decline invitation bez ověření
- [x] Laravel Policies: `ListePolicy`, `HouseholdPolicy` (incl. removeMember), `InvitationPolicy`
- [x] Base `Controller` rozšířen o `AuthorizesRequests`
- [x] `AuthorizationException` → 403 JSON
- [x] Validační status kódy sjednoceny na 422
- [x] `DatabaseOperationException`: loguje real error, vrací generic v produkci
- [x] CORS: `allowed_headers` omezeno na explicitní seznam
- [x] Frontend: `ConfirmDialog` komponenta (místo browser confirm()), `useConfirm` composable
- [x] Household: owner může odebrat člena (`DELETE /household/members/{userId}`)

### Fáze 3 — Produktový katalog ✅ HOTOVO
Musí být před šablonami — vše ostatní stojí na katalogu. Cíl: katalog se buduje přirozeně při používání, uživatel ho nestaví vědomě od nuly.

#### Rozhodnutá architektura a UX

**Přidávání položky do listu — search-as-you-type**
- `AddItemForm` má jeden textový input; po 2+ znacích + 300ms debounce se zobrazí dropdown se suggestions z household katalogu
- Výběr z dropdownu → pre-fill name, quantity, unit (editovatelné před odesláním); `product_id` uloženo interně
- Pokud user změní name po výběru z katalogu → odpojení od produktu, stane se free textem
- Dropdown obsahuje i "Přidat jako nový" pro explicitní free text bez katalogu
- Po přidání free text položky → nenápadný hint "Uložit do katalogu?" pod položkou
- Global catalog v textovém hledání: **ne v Phase 3** — přidáme jako fallback až bude naplněný

**Jednotky**
- `list_items.unit_id` nullable FK → `units`
- Výchozí (když unit nevybrán): interně `null`, zobrazení jako `3×`
- Zobrazení s jednotkou: `mouka 1 kg`; bez jednotky: `vejce 3×`; todo list: jen název bez quantity/unit
- Unit dropdown ve formuláři: skupiny — Počet (ks, balení...) / Hmotnost (g, kg...) / Objem (ml, l...)
- Smart text parsing ("mouka 1kg"): **ne v Phase 3**
- Unit pro todo listy: skryto (quantity i unit)
- Přidání z katalogu → auto-fill `preferred_unit` + `preferred_quantity`, user může přepsat

**Katalog — správa**
- Samostatná sekce v menu s filtry (kategorie, search) + stránkování
- Inline přidávání do katalogu z formuláře pro přidání položky do listu
- Soft delete: `products.deleted_at` — FK v `list_items` ON DELETE SET NULL (historické položky zachovány)
- `category_id` nullable — produkt nemusí mít kategorii
- Globální kategorie: read-only, nelze mazat/upravovat; household může přidat vlastní
- Unikátnost: soft — frontend varuje při přesné shodě jména, žádný DB constraint

**Free tier hook**
- `ProductService::create()` kontroluje počet produktů domácnosti
- Free tier ≥ 50 produktů → `PaymentRequiredException` (HTTP 402)
- Phase 9 nahradí podmínku skutečnou billing logikou

**Barcode scanning (implementováno — viz sekce níže)**
- Scan ikona v `AddItemForm` (jen shopping/packing) → fullscreen `BarcodeScanner.vue` overlay
- Scanner obsahuje celý state machine: scanning → searching → notFound / productFound
- Nalezeno: formulář se předvyplní; Nenalezeno: 3 možnosti v overlaye (viz strategie níže)

#### Backend

- [x] `Product` model se soft delete (`deleted_at`), `ProductService`, `ProductPolicy`
- [x] `Product.created_by` — při odchodu z householdu se uživatelovy produkty zkopírují do jeho vlastního household
- [x] `ProductController`: `GET /products?q=&limit=` (autocomplete), full CRUD
- [x] `UnitController`: `GET /units` — grouped by type s překladem
- [x] `StoreListItemRequest` + `ItemService`: rozšíření o `product_id` → auto-fill z produktu; spec (qty+unit) se zapéká do názvu položky
- [x] `CategoryController`: `GET /categories` (globální + household), POST/PUT/DELETE pro household kategorie
- [x] `GlobalProductController`: `GET /global-products/search?barcode=&q=`
- [x] Filament: resource `GlobalProducts` — verify, edit, bulk delete
- [x] `PaymentRequiredException` (HTTP 402)

#### API routes (implementováno)

```
GET    /products/search?q=&limit=   ProductController@search  → autocomplete (min 2 znaky)
GET    /products                    ProductController@index   → full katalog se stránkováním
POST   /products                    ProductController@store
PUT    /products/{id}               ProductController@update
DELETE /products/{id}               ProductController@destroy (soft delete)

GET    /categories                  CategoryController@index  → globální + household
POST   /categories                  CategoryController@store  → pouze household vlastní
PUT    /categories/{id}             CategoryController@update
DELETE /categories/{id}             CategoryController@destroy

GET    /global-products/search?barcode=&q=   GlobalProductController@search
POST   /global-products                      GlobalProductController@store
       → přijme: name (required), barcode (required), brand (optional)
       → uloží s source='user', household_id = caller's household
       → vrátí 200 s existujícím produktem pokud barcode již existuje pro tuto domácnost

GET    /units                       UnitController@index → grouped by type s překladem
```

**Rozšíření existujícího endpointu:**
`POST /lists/{id}/items` nově přijímá `product_id` (nullable) — pokud zadán a produkt má spec (qty+unit), spec se zapéká do názvu položky; quantity = počet kusů k nákupu

**Sémantika quantity na list_items:**
- `quantity` = kolik kusů daného produktu nakoupit (ne objem/hmotnost balení)
- Spec produktu (500 ml, 1 kg) je součástí názvu položky: "Milk fat 500 ml — 2×"
- Produkty bez spec: quantity + unit_id zůstanou jako přímé měření (1 kg mouky)

#### Frontend

- [x] `AddItemForm` — search-as-you-type autocomplete z katalogu (debounce 300ms, min 2 znaky), unit dropdown (grouped), quantity nullable pro todo listy
- [x] Výběr z katalogu: spec zapečena do názvu položky ("Milk fat 500 ml"), quantity = počet kusů k nákupu
- [x] `CatalogView` — `/catalog` route, list produktů se stránkováním, filter kategorie + search, add/edit/delete form
- [x] Tooltip s `i` ikonkou — vysvětluje sdílení katalogu v rámci household
- [x] `ListDetail` — `formatItem()` zobrazuje qty+unit nebo qty× podle kontextu; skrývá qty/unit pro todo listy
- [x] Nové services: `productService`, `categoryService`, `unitService`
- [x] Typy: `iProduct`, `iCategory`, `iUnit`, `iUnitGroups`; update `iItem` (unit, product_id)
- [x] Menu: Catalog odkaz, `/catalog` route

### Fáze 3.1 — Onboarding
Uživatel musí zažít hodnotu do 3 minut. Bez guided flow většina odejde dřív, než pochopí co app umí.
- [ ] First-run flow pro nového uživatele — krok za krokem: vytvoř seznam → přidej první položky → ulož do katalogu → pozvi partnera
- [ ] Prázdné stavy s výzvou k akci (ne jen "žádné položky") — každá prázdná obrazovka navede co udělat dál
- [ ] Tooltips / hints při první interakci s katalogem, šablonami, inventářem

### Fáze 4 — Skupiny, štítky a akce v seznamech
Sloučení původních Fází 4 a 5 — jsou to dvě strany téhož. Polishová fáze, neblokuje launch.
- [ ] Štítek (Label) — předdefinovaný v rámci household, s názvem a barvou (např. "Osobní věci", "Koupelna", "Ovoce", "Pekárna")
- [ ] Položka může mít přiřazený štítek → vizuálně barevný border + nadpis skupiny
- [ ] Položky bez štítku tvoří výchozí skupinu, skupiny lze sbalit / rozbalit
- [ ] Drag & drop pořadí položek uvnitř skupiny (drag mezi skupinami jako stretch goal — komplexní na mobilu)
- [ ] Hromadný výběr — dlouhý stisk aktivuje checkbox mode → hromadné smazání / označení / přiřazení štítku
- [ ] Řazení seznamu — podle názvu, stavu (splněno/nesplněno), vlastního pořadí

### Fáze 5 — Shopping mode & Historie listů
UX pro reálné použití v terénu — v obchodě, při balení, na cestách.
- [ ] **Shopping mode** — focused view při aktivním plnění seznamu: velká písma, velké checkboxy, nezaškrtnuté položky vždy nahoře, obrazovka nespadne do spánku (Wake Lock API)
- [ ] **Archiv splněných listů** — dokončený seznam se archivuje s datem místo smazání ("nákup 3. dubna")
- [ ] Opakovat archivovaný seznam — jedním kliknutím vytvoří kopii jako nový aktivní seznam
- [ ] Rychlé přidání položky hlasem — Web Speech API, žádná extra závislost, klíčové pro mobil

### Fáze 6 — Šablony & Recepty
Šablony jsou obecné (cokoliv opakujícího se), recepty jsou speciální typ šablony s vazbou na porce.
- [ ] Template = pojmenovaná skupina produktů z katalogu
- [ ] Kategorie šablon (Vaření / Cestování / Domácnost / Sport / ...)
- [ ] **"Uložit aktuální seznam jako šablonu"** — přirozená cesta jak šablony vznikají, ne stavění od nuly
- [ ] Přidat šablonu do existujícího seznamu (batch přidání položek)
- [ ] Vytvořit nový seznam ze šablony
- [ ] **Recepty jako speciální typ šablony** — ingredience s množstvím vázaným na počet porcí, škálování ("recept pro 4, vaříme pro 6 → přizpůsob množství")
- [ ] Příklady šablon: Chleba, Dovolená u moře, Horská turistika, Úklid bytu, Grilování...

### Fáze 7 — Inventář
Inventář uzavírá smyčku: nakoupíš → potvrdíš → app ví co máš doma → příště navrhne co chybí.
- [ ] Potvrzení dokončeného nákupu
- [ ] Automatická aktualizace zásob po potvrzení
- [ ] Přehled co máš doma
- [ ] **Minimální hranice zásoby** — nastavíš "máslo: minimum 1 ks", při poklesu se automaticky přidá do příštího seznamu
- [ ] Návrhy co dochází při tvoření nového seznamu

### Fáze 8 — Notifikace
- [ ] Push notifikace přes PWA — partner přidal položku, sdílení seznamu, pozvánka do domácnosti
- [ ] In-app notifikace s přehledem aktivity
- [ ] Upozornění na nízký stav zásoby (propojení s inventářem)

### Fáze 8.1 — Frontend testy (před nasazením)

Implementovat těsně před Fází 9 — když jsou core features stabilní a přicházejí platící uživatelé.

**Vitest — unit testy composables**
- `useLists` — fetch, create, delete, reorder
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

**Free tier (návrh):**
- Neomezené listy a položky
- 1 household (sdílení s 1 partnerem)
- Katalog do 50 produktů
- Bez šablon, bez inventáře

**Pro (~€2–4/měsíc):**
- Neomezený katalog
- Šablony a recepty
- Inventář
- Sdílení s více členy household
- Historie archivovaných listů

> Free tier musí být dost štědrý aby uživatel zažil hodnotu (první seznam, sdílení), ale Pro musí obsahovat přesně to co ho po 2 týdnech bude bolet postrádat (šablony, inventář).

- [ ] Jeden jednoduchý placený plán — žádné matoucí tabulky, žádné "Teams" / "Enterprise"
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
- **Nyní:** Hetzner CX22 (~€4.51/měsíc) — 2 vCPU, 4 GB RAM, vše na jednom serveru via Docker Compose
- **Email:** Resend (free tier)
- **Do budoucna:** Škálování řešit až při potřebě (500+ aktivních uživatelů)

#### Docker produkční setup (připraveno)

**Soubory:**
```
docker-compose.prod.yml          ← produkční stack
docker/php/Dockerfile.prod       ← PHP-FPM, kód baked in, composer --no-dev
docker/php/entrypoint.prod.sh    ← config:cache, route:cache, storage:link při startu
docker/nginx/Dockerfile.prod     ← multi-stage: npm run build → nginx
docker/nginx/default.prod.conf   ← HTTPS, Vue SPA, Reverb WebSocket proxy, Laravel API
frontend/.env.production.example ← šablona: VITE_APP_NAME + VITE_REVERB_APP_KEY
deploy.sh                        ← ./deploy.sh setup domain.com | ./deploy.sh update
```

**Kontejnery v produkci:**
```
php        — Laravel PHP-FPM
nginx      — HTTPS + Vue SPA + proxy → PHP a Reverb
postgres   — databáze (volume postgres_data)
reverb     — WebSocket server (port 6001, interní)
queue      — php artisan queue:work
scheduler  — php artisan schedule:work
certbot    — Let's Encrypt, auto-renewal každých 12h
```

**Reverb WebSocket v produkci:**
nginx terminuje SSL a proxuje `wss://domain.com/app/*` → `http://reverb:6001/app/*`.
`echo.ts` auto-detekuje: `import.meta.env.DEV` → port 6001 přímý; prod build → port 443 přes nginx.

**SSL certifikát:**
Certbot + Let's Encrypt přes webroot challenge (nginx obsluhuje `/.well-known/acme-challenge/`).

**První nasazení:**
```bash
# Na VPS (Ubuntu/Debian):
apt install docker.io docker-compose-plugin
git clone <repo> && cd shopping-list-laravel
cp backend/.env.example backend/.env   # vyplnit hodnoty
# V docker/nginx/default.prod.conf změnit DOMAIN na skutečnou doménu
./deploy.sh setup yourdomain.com
```

**Aktualizace:**
```bash
./deploy.sh update   # git pull → rebuild → migrate → restart
```

**Env proměnné pro build (baked do JS):**
Předávají se jako Docker build args z `.env` souboru v kořeni repozitáře:
```
VITE_APP_NAME=...
VITE_REVERB_APP_KEY=...   # shoduje se s REVERB_APP_KEY v backend/.env
```

#### ⚠️ Queue Worker — vyřešeno v produkčním Docker Compose
Broadcasting eventy používají `ShouldBroadcastNow` (synchronní). Pokud bude potřeba přepnout na async:
změnit na `ShouldBroadcast` — queue worker kontejner je již přítomen v `docker-compose.prod.yml`.

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

GET    /lists                       ListController@index
POST   /lists                       ListController@store
GET    /lists/{id}                  ListController@show
PUT    /lists/{id}                  ListController@update
DELETE /lists/{id}                  ListController@destroy

POST   /lists/{id}/items            ListItemController@store
GET    /lists/{id}/items/{itemId}   ListItemController@show
PUT    /lists/{id}/items/{itemId}   ListItemController@update
DELETE /lists/{id}/items/{itemId}   ListItemController@destroy
```

**Vrstvy**
```
app/Http/Controllers/Api/   AuthController, HouseholdController, InvitationController,
                            ListController, ListItemController,
                            CategoryController, ProductController,
                            GlobalProductController, UnitController
app/Service/                ListService, ItemService, ProductService, OpenFoodFactsService
app/Mapper/                 ListMapper, ItemMapper, HouseholdMapper
app/Models/                 User, Household, Invitation, Liste (model pro tabulku lists),
                            ListItem, Category, CategoryTranslation,
                            GlobalProduct, Product, Unit, UnitTranslation, Language
app/Events/                 ListCreated, ListUpdated, ListDeleted,
                            ItemAdded, ItemUpdated, ItemDeleted, ItemsReordered
app/Exceptions/Domain/      ResourceNotFoundException, ValidationException, PaymentRequiredException
app/Exceptions/Infrastructure/ DatabaseOperationException
```

**Databáze — klíčové FK kaskády**
```
users
  └─(owner_id)─► households ──CASCADE──► lists ──CASCADE──► list_items
users ─CASCADE──► household_user (pivot: role owner/member)
users ─CASCADE──► invitations (invited_by)
households ─CASCADE──► invitations
lists ─CASCADE──► list_items  (list_id)
```

---

### Frontend — `frontend/src/`

**Router** `router/index.ts`
```
/                               landing         (requiresGuest)
/login                          login           (requiresGuest)
/forgot-password                forgot-password (requiresGuest)
/reset-password                 reset-password  (requiresGuest)
/email-verify                   email-verify
/email-verified                 email-verified
/invitations/:token/accept      invitation-accept
/invitations/:token/decline     invitation-decline
/lists                          home            (requiresAuth)
/lists/new                      new-list        (requiresAuth)
/lists/:id                      list-detail     (requiresAuth, beforeEnter: fetchList)
/catalog                        catalog         (requiresAuth)
/household                      household       (requiresAuth)
/settings                       settings        (requiresAuth)
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
CreateList.vue
ListDetail.vue              položky listu, real-time sync
CatalogView.vue             katalog produktů — search, filter, CRUD
InvitationView.vue          přijmout / odmítnout pozvánku
HouseholdView.vue           ownHousehold (edit, members, invite) + joinedHouseholds (leave)
SettingsView.vue            profil, heslo
```

**Services** `services/`
```
api.ts                  apiFetch() — CSRF cookie + X-XSRF-TOKEN header, credentials: include
authService.ts          register, login, logout, getUser, forgotPassword, resetPassword,
                        updateProfile, updatePassword, resendVerification
householdService.ts     getHousehold, updateHousehold, sendInvitation, leaveHousehold(id)
listService.ts          fetchList, fetchLists, createList, updateList, deleteList
itemService.ts          createItem, updateItem, deleteItem, reorderItems
productService.ts       searchProducts, getProducts, createProduct, updateProduct, deleteProduct
categoryService.ts      getCategories, createCategory, updateCategory, deleteCategory
unitService.ts          getUnits
globalProductService.ts searchByBarcode, storeUserProduct
```

**Stores** `stores/`
```
auth.ts    user, loading, initialized, isAuthenticated, isEmailVerified
           fetchUser, login, register, logout
```

**Klíčové typy** `types/index.ts`
```
iUser, iHousehold, iHouseholdMember, iHouseholdOverview,
iItem, iList, iNewList, ListType, ListStatus,
iProduct, iGlobalProduct, iCategory, iUnit, iUnitGroups
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
- `./vendor/bin/phpstan analyse --memory-limit=512M` — statická analýza (bez memory-limit worker crash)

**Frontend**
- `vue-tsc --build` (`npm run type-check`) — typová kontrola TypeScriptu přes vue-tsc (rozumí `<script setup>` v `.vue` souborech)
- `npm run lint` — ESLint + Oxlint
- `npm run build` — zahrnuje type-check automaticky (`run-p type-check build-only`), produkční build se nezkompiluje při typových chybách

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
| Databáze | PostgreSQL 17 |
| Billing | Laravel Cashier + Stripe |
| Superadmin | vlastní middleware + admin sekce |

---

---

## Budoucí features (post-launch backlog)

Funkce které mají smysl v kontextu aplikace, ale přicházejí až po spuštění a validaci.

### Sociální & spolupráce
- **Přiřazování položek členům** — "táta koupí pivo, máma vyzvedne děti, syn vyvenčí psa". Rozšiřuje core use case pro celou domácnost.
- **Chat / komentáře v rámci domácnosti** — komunikace při sdíleném plánování (dovolená, týdenní menu, úkoly).
- **Veřejné šablony (komunita)** — uživatelé sdílí oblíbené šablony (balení na hory, weekly chores, nákup před Vánoci). Potřebuje dostatek uživatelů.

### AI funkce
- **AI návrhy položek ze zvyklostí** — "každý pátek kupuješ pivo, přidat?" Vyžaduje historii reálných uživatelů → až po nasbírání dat.
- **OCR skenování účtenky → inventář** — vyfotíš účtenku, položky se automaticky přidají do inventáře. Silný differenciátor.
- **AI generování seznamu z receptu** — zadáš URL receptu nebo fotku, app vytvoří nákupní seznam. Nezávislé na datech uživatele.
- **Předpověď spotřeby** — "máslo ti dojde za ~5 dní". Vyžaduje historii spotřeby → až po datech.

### Gamifikace & motivace
- **Streaky** — kolik týdnů za sebou jsi splnil plán (nákup, úkoly, balení). Engagement funkce po validaci.
- **Rodinné body / odměny pro děti** — děti plní úkoly (vynes koš, ukliď pokoj) a sbírají body. Dává smysl pokud app pokryje "domácí úkoly" jako typ listu. Validovat zájem.

### Domácnost jako hub
- **Připomínky pravidelných plateb** — nájem, předplatné, pojistka. Jako recurring reminder list.
- **Správa spotřebičů** — záruky, servisní intervaly (servis auta, výměna filtru). Jako reminder list s datem.

### Integrace & platformy
- **Widget pro iOS/Android** — rychlé přidání položky/úkolu bez otevření app. Kvalita života.
- **Export do PDF / tisk** — balení na cesty, nákupní seznam pro babičku. Jednoduchá win.
- **Google Calendar** — připomínky a recurring tasky jako kalendářní události.
- **Alexa / Google Home** — hlasové přidávání ("přidej mléko do nákupu"). Nízká priorita.

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
