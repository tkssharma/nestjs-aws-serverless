# @cdc3/nestjs-api-api

## Getting Started

Install dependencies

```
npm ci
```

Build

```
npm run build
```

Load env variables

```bash
export $(cat .env.local | grep -v '^#' | xargs -I{} sh -c 'v="{}"; printf "%s " $v')
```

## Deploy App using AWS CDK 

```bash
npm run deploy
```
