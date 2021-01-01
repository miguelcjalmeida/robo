export interface IWatcher {
  init(): Promise<void>
  next(): Promise<INotification>
}

export interface INotification {
  anyChange: boolean
  message: string
}

export interface IWatcherRepository {
  all(): IWatcher[]
}

export interface INotifier {
  notify(notifications: INotification[]): Promise<void>
}

export interface IRequester {
  request(uri: string): Promise<Document>
}
