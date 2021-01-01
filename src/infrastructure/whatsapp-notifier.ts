import { INotification, INotifier } from '../core/core'
import * as twilio from 'twilio'

export class WhatsAppNotifier implements INotifier {
  constructor(private twilio: twilio.Twilio) {}

  async notify(notifications: INotification[]): Promise<void> {
    let message = `${notifications.length} change(s):\n`
    notifications.forEach((x) => (message += `${x.message}\n`))

    await this.twilio.messages.create({
      body: message,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+5519988671494',
    })
  }
}
