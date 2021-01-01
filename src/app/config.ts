export class Config {
  whatsApp: { accountId: string; authToken: string }

  start() {
    this.whatsApp = {
      accountId: this.env('WHATSAPP_ACCOUNT_ID'),
      authToken: this.env('WHATSAPP_AUTH_TOKEN'),
    }
  }

  private env(envName: string) {
    if (!process.env[envName]) throw new Error(`env '${envName} not set`)
    return process.env[envName]
  }
}
