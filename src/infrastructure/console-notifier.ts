import { INotification, INotifier } from '../core/core'

export class ConsoleNotifier implements INotifier {
  async notify(notifications: INotification[]): Promise<void> {
    console.log(`${notifications.length} changes were detected`)
    notifications.forEach((x) => {
      console.log(x.message)
    })
  }
}
