# Публикация на GitHub Pages

Репозиторий: https://github.com/qsqgjhngyt-maker/sharolyot-expedition

Исходники автоматически проверяются и собираются через `.github/workflows/pages.yml`. Сборка публикует только `dist`, включая сервис-воркер, manifest и иконки. Бесплатные зависимости закреплены в package-lock.json. Никакие токены или пароли в проект не включаются.

## Первичное включение Pages

В репозитории откройте **Settings → Pages → Build and deployment → Source → GitHub Actions**. Это одноразовая настройка. После неё запустите workflow `Build and deploy game` в разделе Actions, если первый запуск произошёл до включения Pages.

Ожидаемый адрес: https://qsqgjhngyt-maker.github.io/sharolyot-expedition/ . Адрес считается опубликованным только после успешного deployment; наличие файлов в репозитории само по себе не подтверждает готовность страницы.

## Локальная сборка из GitHub

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
node server.mjs
```

Папка dist не отслеживается в Git: её создаёт сборка. В отдельном готовом архиве Codex dist уже включена для запуска без установки npm-зависимостей.

## Что проверяет workflow

Node.js 24, установка закреплённых зависимостей, проверки логики игры, manifest и offline-кеша, TypeScript, Vite-сборка и создание версионированного сервис-воркера. Публикация использует только штатный GITHUB_TOKEN с правами contents:read, pages:write, id-token:write. Этот токен существует внутри GitHub Actions и не попадает в игру.

Документация: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site.

Фан-игра не является официальной. Публичная публикация исходников не предоставляет прав на защищённые образы персонажей и корабля; сведения — в NOTICE.txt.
