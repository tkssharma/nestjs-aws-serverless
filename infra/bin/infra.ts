#!/usr/bin/env node

// Native.
import * as path from "path";

// Package.
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

// Internal.
import { NestjsApiStack } from "../stacks/nestjs-stack";

// Code.
const app = new cdk.App();

const stage = process.env.STAGE || "development";

const env: cdk.Environment = {
  account: process.env.AWS_ACCOUNT_ID, // xxxxxxx
  region: "us-east-1",
};

const projectName = path.basename(path.join(__dirname, "..", ".."));

// API Proxy to lambda
const isLocal = stage === "local";

new NestjsApiStack(app, `nestjs-api-stack-${stage}`, {
  stage,
  lambdaHandler: "build/lambda.handler",
  lambdaPath: isLocal
    ? path.resolve(`/tmp/${projectName}`)
    : path.resolve(__dirname, "..", "..", `${projectName}.zip`),
  env,
  tags: { domain: "service", service: "nestjs-apis" },
  stackName: `nestjs-api-${stage}`,
  description:
    "Nestjs API stack",
  terminationProtection: false,
});
