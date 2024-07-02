# @cdc3/nestjs-api

This is a part of video tutorials This Video is a Part of the playlist "Building Microservices and Deploying for SAAS Product" and  it covers all about building microservices for Enterprise World

Link -  https://www.youtube.com/playlist?list=PLIGDNOJWiL19tboY7wTzz6_RY6h2gpNrH
Primary Github - https://github.com/tkssharma/microservices

Old GitHub Links
Github: https://github.com/tkssharma/12-factor-app-microservices
https://github.com/tkssharma/nestjs-graphql-microservices
https://github.com/tkssharma/nodejs-microservices-patterns

In this playlist, we will talk about microservices development with  node js of all different types 
like 

- Express/Nest JS with Typescript with ORM (TypeORM, knex, Prisma)
- Deploying Services with AWS  CDK Constructs with RDS/Dynamodb
- Building Different Microservice Architecture
- Using Event-Driven Arch, CQRS, Event Sourcing based Arch 
- Deploying services using AWS ECS or Lambda using AWS CDK

Here are some common microservices architecture patterns and best practices when using Node.js:
1. Single Service Microservice Architecture:
2. Layered Microservice Architecture:
3. Event-Driven Microservice Architecture:
4. API Gateway Microservice Architecture:
5. Service Mesh Microservice Architecture:
6. Serverless Microservices:
7. Containerized Microservices:
8. Event Sourcing and CQRS:
9. BFF (Backend For Frontend) Microservice Architecture:
10. Database Microservice Architecture:

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
