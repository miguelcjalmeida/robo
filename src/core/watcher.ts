import { INotification, IWatcher } from './core'

export abstract class Watcher implements IWatcher {
  abstract next(): Promise<INotification>
  abstract init(): Promise<void>
}
