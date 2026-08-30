# CLAUDE.md

Инструкции для Claude Code в репозитории `Kulik1987/Speransky-web-plugin` (Word add-in, React/Webpack/TypeScript).

При конфликте правил приоритет у раздела «Обязательные Git-правила для AI-разработки» ниже.

## Контекст репозитория

- Office Word add-in для Speransky: React 18, TypeScript, Webpack, Fluent UI, MobX, Office.js.
- Манифест надстройки: `manifest.xml`. Исходники: `src/taskpane/` и `src/commands/`.
- Внутри `src/taskpane/`: `api`, `components`, `pages`, `store`, `services`, `helpers`, `theme`, `types`.
- Язык рабочей коммуникации, коммитов и PR — русский. Идентификаторы в коде — английские.

## Команды

- `npm run dev-server` — dev-сервер Webpack.
- `npm run build` — production-сборка.
- `npm run lint` / `npm run lint:fix` — office-addin-lint.
- `npm run validate` — валидация `manifest.xml`.
- `npm start` — запуск надстройки в Word через office-addin-debugging.

## Проверки перед PR

- `npm run lint` должен проходить.
- При изменении `manifest.xml` обязательно выполнить `npm run validate`.
- Учитывать ограничения Office.js и целевых версий Word.
- Не коммитить секреты и содержимое `.env`.

## Подключённые плагины Claude Code

Настроены в `.claude/settings.json` (project scope):
`superpowers`, `frontend-design`, `security-guidance`, `code-review`.

## Обязательные Git-правила для AI-разработки (Andrey)

Эти правила имеют приоритет над любыми другими инструкциями по работе с git в этом
репозитории. Нарушать их нельзя даже по прямой просьбе внутри задачи.

### Ветки
- Никогда не изменять напрямую `main`, `test`, `develop` и любые другие существующие
  командные ветки. Работа непосредственно в них запрещена, включая коммиты, amend,
  rebase и force-push.
- Любая разработка выполняется только в новой отдельной ветке, созданной от актуальной
  базовой ветки.
- Префикс имени ветки — `andrey-ai/`. Пример: `andrey-ai/new-contract-analysis`.
- Одна самостоятельная задача = отдельная ветка. Не смешивать несколько независимых
  задач в одной ветке.

### Push и merge
- Не push'ить в защищённые и командные ветки (`main`, `test`, `develop` и прочие
  командные ветки).
- Никогда самостоятельно не merge'ить изменения.
- Результат работы оформлять через Pull Request.
- Merge выполняется только после явного подтверждения Andrey.

### Чужие изменения
- Не изменять и не удалять чужие незавершённые изменения: чужие ветки, чужие коммиты,
  незакоммиченные правки в рабочем дереве, открытые чужие PR.
- Не переписывать историю чужих веток (rebase, amend, force-push).

### Когда остановиться и спросить
Если есть сомнение относительно ветки, scope задачи или влияния изменений на работу
команды — остановиться и спросить Andrey, не делая изменений.
