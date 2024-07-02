// Code.

/**
 * Load env variables used at build time to deploy the iac
 */
export class Config {
  public static get debug() {
    return process.env.DEBUG || "app:*";
  }


  public static get nodeEnv() {
    return process.env.NODE_ENV || "production";
  }

  public static get logLevel() {
    return process.env.LOG_LEVEL || "info";
  }

  private constructor() { }
}
