# Сайт Throne Studios: статичные страницы, которые отдаёт nginx. Сборки нет — образ просто копирует файлы.
FROM nginx:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html 404.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY storyveil/ /usr/share/nginx/html/storyveil/
COPY studio/ /usr/share/nginx/html/studio/
COPY contacts/ /usr/share/nginx/html/contacts/
COPY en/ /usr/share/nginx/html/en/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
