import { INotification, INotifier, IWatcher } from './core'

export async function notifyNextFactory(
  watchers: IWatcher[],
  notifier: INotifier
) {
  let firstIteration = true

  await Promise.all(watchers.map((x) => fallbackInit(x.init())))

  return async () => {
    const results = await Promise.all(
      watchers.map((x) => fallbackToNoChanges(x.next()))
    )

    const changes = results.filter((x) => x.anyChange || firstIteration)
    if (changes.length > 0) await notifier.notify(changes)
    firstIteration = false
  }
}

async function fallbackToNoChanges(
  promise: Promise<INotification>
): Promise<INotification> {
  try {
    return await promise
  } catch (ex) {
    console.log('watcher error on next', ex)

    return {
      anyChange: false,
      message: '',
    }
  }
}

async function fallbackInit(promise: Promise<void>): Promise<void> {
  try {
    return await promise
  } catch (ex) {
    console.log('error initing watcher', ex)
  }
}
