# FORUM API [![javascript style guide][standard-image]][standard-url]

[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com


## Local Development

### Prerequisites

- [NodeJS](https://nodejs.org/en/download/current/) version >= 14
- [PostgreSQL](https://www.postgresql.org/download/)

### First Run

1. Clone repository
1. Copy [.env.example](.env.example) to .env and adjust the values inside.
1. Install dependencies
   ```bash
   npm i
   ```
1. Run migration
   ```bash
   npm run migrate up
   npm run migrate:test up # For automation testing
   ```
1. Start development server
   ```bash
   npm run start:dev
   ```
   
### Useful Scripts
- `start` => run production server
  ```bash
  pm2 start npm --name "auth-api" -- run "start"
  ```
- `format` => format code with [standardjs](https://standardjs.com) style
- `test` => run comprehensive tests with coverage report
- `test:watch` => run all tests when a file has changed
- `test:watch:changed` => run tests related to changed files
- `test:newman` => run postman tests on CLI

## Notes
- Endpoint: https://spicy-fireant-6.a276.dcdg.xyz/
- Repository: https://github.com/kamalmahmudi/forum-api
-  Github workflows: https://github.com/kamalmahmudi/forum-api/actions
    - ❌ Failed CI: https://github.com/kamalmahmudi/forum-api/actions/runs/1666715183
    - ✔️ Success CI: https://github.com/kamalmahmudi/forum-api/actions/runs/1667189776
    - ❌ Failed CD: https://github.com/kamalmahmudi/forum-api/actions/runs/1666037340/attempts/1 (this action was executed for second time, so it's a success now)
    - ✔️ Success CD: https://github.com/kamalmahmudi/forum-api/actions/runs/1666062409