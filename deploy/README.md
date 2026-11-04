# Деплой сайта Throne Studios

Dokploy, проект **Throne Studios**, только окружение `production`, без стейджа.
Приложение `website`: GitHub `Akshin/novella-game`, ветка `main`, Build Type — Dockerfile (`Dockerfile` в корне),
Build Path `/`. Auto Deploy включён: каждый пуш в `main` выкатывает сайт.

Пуш доходит до Dokploy вебхуком GitHub-приложения Dokploy (то же, что у Vekas). Деплой стартует
через пару секунд после пуша, сборка занимает 5–15 секунд, а потом ещё несколько секунд
меняется контейнер — проверять сайт раньше чем через полминуты бессмысленно.
Если в Dokploy → website → Deployments нового деплоя нет, значит, вебхук не дошёл
(GitHub изредка теряет доставку): нажмите Deploy вручную.

Образ — `nginx:1.27-alpine` с файлами сайта, сборки нет. Настройки nginx — `deploy/nginx.conf`:

- страницы отдаются с `Cache-Control: no-cache`, правки видны сразу;
- `assets/` кешируется на неделю. CSS и JS подключены с `?v=N`: после правки стилей или скриптов
  поднимите номер во всех `index.html`, иначе посетители неделю будут видеть старую версию;
- неизвестные адреса получают `404.html` (пути в нём абсолютные, от корня домена);
- английская версия — основная и лежит в корне, русская — в `/ru/`. Старые адреса `/en/…` отвечают 301 на те же страницы без `/en`.

## Домен

`thronestudios.ink`, DNS в Namecheap (BasicDNS): A-записи `@` и `www` → `31.220.77.48`, сервер Dokploy.
В приложении → Domains оба адреса: Container Port `80`, HTTPS, сертификат Let's Encrypt.
С `www` nginx отвечает 301 на адрес без `www` (`deploy/nginx.conf`).
Этот адрес прописан в `og:url`, `og:image` и `hreflang` всех `index.html`.

## Логотипы и картинки

```bash
uv run tools/build_brand.py    # логотипы, фавиконы, превью ссылок — из tools/brand/
uv run tools/build_assets.py   # персонажи и фоны — из соседнего проекта novella
```
