# Деплой сайта Throne Studios

Dokploy, проект **Throne Studios**, только окружение `production`, без стейджа.
Приложение `website`: GitHub `Akshin/novella-game`, ветка `main`, Build Type — Dockerfile (`Dockerfile` в корне),
Build Path `/`. Auto Deploy включён: каждый пуш в `main` выкатывает сайт.

Образ — `nginx:1.27-alpine` с файлами сайта, сборки нет. Настройки nginx — `deploy/nginx.conf`:

- страницы отдаются с `Cache-Control: no-cache`, правки видны сразу;
- `assets/` кешируется на неделю. CSS и JS подключены с `?v=N`: после правки стилей или скриптов
  поднимите номер во всех `index.html`, иначе посетители неделю будут видеть старую версию;
- неизвестные адреса получают `404.html` (пути в нём абсолютные, от корня домена).

## Домен

В приложении → Domains: домен сайта, Container Port `80`, HTTPS, сертификат Let's Encrypt.
Перед этим A-запись домена (и `www`, если нужен) — на IP сервера Dokploy.

После подключения домена поменяйте адрес `https://akshin.github.io/novella-game/` на новый
в `og:url`, `og:image` и `hreflang` всех восьми `index.html`.

## Логотипы и картинки

```bash
uv run tools/build_brand.py    # логотипы, фавиконы, превью ссылок — из tools/brand/
uv run tools/build_assets.py   # персонажи и фоны — из соседнего проекта novella
```
