import { INotification, INotifier } from '../core/core'
import * as notifier from 'node-notifier'

export class OSNotifier implements INotifier {
  async notify(notifications: INotification[]): Promise<void> {
    return new Promise((resolve, reject) => {
      let message = `${notifications.length} change(s):\n`
      notifications.forEach((x) => (message += `${x.message}\n`))
      notifier.notify(message, (err, response) => {
        if (err) return reject()
        resolve()
      })
    })
  }
}
