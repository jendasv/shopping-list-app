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

GlobalProducts  ← crowdsourced + Open Food Facts, sdílená přes všechny domácnosti
├── id
├── barcode       (EAN-13, UPC-A, QR...)
├── name
├── brand         (nullable)
├── default_category_id (nullable, FK → global category)
├── default_unit_id     (nullable, FK → units)
├── image_url     (nullable)
├── source        (enum: user_scan, open_food_facts, admin)
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

### Barcode scanning — strategie

```
Uživatel naskenuje čárový kód
  │
  ├── 1. Hledej v global_products (vlastní DB, okamžité)
  │       → nalezeno → "Mouka hladká Mlýn Herold, přidat?" → scan_count++
  │
  ├── 2. Nenalezeno → dotaz na Open Food Facts API (free, bez API klíče)
  │       → nalezeno → ulož do global_products (source: open_food_facts) → zobraz
  │
  └── 3. Nenalezeno nikde → uživatel zadá ručně
              → opt-in: "Přidat do sdílené knihovny?"
              → pokud ano → global_products (source: user_scan, verified: false)
```

Technologie: `zxing-wasm` (WebAssembly — funguje ve všech prohlížečích, lazy load ~500kB).
Web Barcode Detection API pouze jako progressive enhancement tam kde je dostupné.

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

### Fáze 2.2 — Refactor: List types + přejmenování
Nutné před katalogem — levnější teď než po rozsáhlé implementaci.
- [ ] Migrace: `shopping_lists` → `lists`, `items` → `list_items`
- [ ] Přidat `list_type` (enum: `shopping`, `packing`, `todo`) na `lists`
- [ ] Přidat `name` (nullable), `unit_id` (nullable), `notes` (nullable) na `list_items`
- [ ] Přejmenovat Eloquent modely: `ShoppingList` → `List`, `Item` → `ListItem`
- [ ] Aktualizovat všechny controllers, services, mappers, testy
- [ ] Nové tabulky seedované: `languages`, `units`, `unit_translations`
- [ ] Nová tabulka: `global_products` (prázdná, plní se postupně)
- [ ] Kategorie: přidat `is_global`, `household_id`, seedovat globální kategorie s překlady

### Fáze 3 — Produktový katalog
Musí být před šablonami — vše ostatní stojí na katalogu. Cíl: katalog se buduje přirozeně při používání, uživatel ho nestaví vědomě od nuly.

**Household katalog**
- [ ] CRUD pro `products` (katalog domácnosti)
- [ ] CRUD pro vlastní kategorie domácnosti
- [ ] Vyhledávání / našeptávač při přidávání do seznamu (`GET /products?q=mo...`)
- [ ] Přidat produkt z katalogu přímo do konkrétního seznamu
- [ ] Uložit položku ze seznamu do katalogu (free text → produkt)
- [ ] Preferované množství + jednotka uloženy jako default při přidávání do seznamu
- [ ] Poznámky k produktu — brand preference, obchod, "jen bio", "červené víčko"

**Barcode scanning**
- [ ] Integrace `zxing-wasm` — lazy load, funguje ve všech prohlížečích
- [ ] Scan flow: own DB → Open Food Facts API → manuální zadání + opt-in příspěvek
- [ ] Pokud kamera nedostupná (desktop) → tlačítko skryto

**Globální produktová knihovna**
- [ ] `GlobalProductController` — vyhledávání podle barcode / názvu
- [ ] Při úspěšném scanu: uložit do `global_products` (source, verified = false)
- [ ] Při přidání z knihovny: vytvořit `Product` v household katalogu s `global_product_id`
- [ ] Admin (Filament): správa `global_products` — verify, merge duplicates, edit

**Nové API routes (Fáze 3)**
```
GET    /products                    ProductController@index   → katalog domácnosti (search, pagination)
POST   /products                    ProductController@store   → přidat do katalogu
PUT    /products/{id}               ProductController@update
DELETE /products/{id}               ProductController@destroy
POST   /products/{id}/add-to-list   ProductController@addToList → přidat z katalogu do listu

GET    /categories                  CategoryController@index  → globální + household kategorie
POST   /categories                  CategoryController@store  → vytvořit vlastní kategorii
PUT    /categories/{id}             CategoryController@update
DELETE /categories/{id}             CategoryController@destroy

GET    /global-products/search      GlobalProductController@search  → hledat v knihovně (barcode / název)
```

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
| Databáze | MySQL 8 |
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
