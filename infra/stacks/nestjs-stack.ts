// Native.
import * as fs from "fs";
import * as path from "path";

// Package.
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

// Internal.
import { Config } from "../lib/config";

// Code.
export interface NestjsApiStackProps extends cdk.StackProps {
  stage: string;
  lambdaPath: string;
  lambdaHandler: string;
}

export class NestjsApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: NestjsApiStackProps) {
    super(scope, id, props);

    const { stage, lambdaHandler, lambdaPath } = props;


    if (!fs.existsSync(path.resolve(lambdaPath))) {
      throw new Error("Lambda code zip file does not exist");
    }


    // sns lambda trigger for Nestjs
    const nestjsLambda = new cdk.aws_lambda.Function(
      this,
      `nestjs-api-lambda-${stage}`,
      {
        functionName: `nestjs-api-${stage}`,
        code: cdk.aws_lambda.Code.fromAsset(lambdaPath),
        handler: lambdaHandler,
        runtime: cdk.aws_lambda.Runtime.NODEJS_16_X,
        memorySize: 512,
        logRetention: cdk.aws_logs.RetentionDays.FIVE_DAYS,
        environment: {
          STAGE: stage,
          DEBUG: Config.debug,
          NODE_ENV: "production",
          LOG_LEVEL: Config.logLevel
        },
        timeout: cdk.Duration.seconds(10),
        initialPolicy: [

          new cdk.aws_iam.PolicyStatement({
            effect: cdk.aws_iam.Effect.ALLOW,
            actions: ["sns:*"],
            resources: ["*"],
          }),
        ],
      }
    );

    const apiGw = new cdk.aws_apigateway.LambdaRestApi(this, `nestjs-api-gw`, {
      handler: nestjsLambda,
      deploy: true,
      proxy: true,
      binaryMediaTypes: ["*/*"],
      deployOptions: {
        stageName: stage
      },
    });

    new cdk.CfnOutput(this, "nestjs-api-gw-id", {
      exportName: "nestjs-api-gw",
      value: apiGw.restApiName,
    });

    new cdk.CfnOutput(this, "nestjs-lambda-arn", {
      exportName: "nestjs-lambda-arn",
      value: nestjsLambda.functionArn,
    });
  }
}
