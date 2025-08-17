# Frontend

React + Vite frontend for Coulisses Crew Ultra V2.

## Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Build

```bash
npm run build
```

## Demo

Fetch the authenticated user with a stored token:

```ts
import { me } from './src/lib/api'

const token = localStorage.getItem('token')!
me(token).then(console.log)
```
