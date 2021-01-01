import { INotification, INotifier } from '../core/core'

export class Notifier implements INotifier {
  constructor(
    private consoleNotifier: INotifier,
    private osNotifier: INotifier,
    private whatsNotifier: INotifier
  ) {}

  async notify(notifications: INotification[]): Promise<void> {
    await this.consoleNotifier.notify(notifications)
    await this.osNotifier.notify(notifications)
    await this.whatsNotifier.notify(notifications)
  }
}
