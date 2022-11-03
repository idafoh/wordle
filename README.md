# SÓZLE (a.k.a WORDLE)

### The purpose of this game is to collect an open database of [Karakalpak](https://en.wikipedia.org/wiki/Karakalpak_language) words


Download database:

Send HTTP GET request to `https://sozle.qaraqalpaq.org/api/db` and then rename the downloaded file with extension `.sqlite3`

Database schema:

`id`  - autoincrement primary key
`word` - 5 letter word candidate
`score` - float between 0 and 1 to check how real word is. (currently guessed words get 0 shared words 0.3)

| id  | word  | score | 
| --- | ----- | ----- |
| 1   | qálem |   0   |
| 2   | sálem |  0.3  |


## Phase 1

Collect as many as possible words. Currently, the score for guessed words is 0, and for shared words 0.3

## Phase 2

We have to re-score all possible word candidates. (How? IDK I haven't planned yet.)

### Found mistakes or ideas

Feel free to create an issue or PR

## Local Setup

Make sure to install the dependencies:

```bash
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
pnpm dev -o
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```
