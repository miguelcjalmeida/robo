import { IRequester, IWatcher, IWatcherRepository } from '../core/core'
import { InvictaWatcher } from '../invicta/invicta-watcher'

export class WatcherRepository implements IWatcherRepository {
  constructor(private requester: IRequester) {}

  all(): IWatcher[] {
    return [
      new InvictaWatcher(
        // 'http://www.invictaonline.com.br/produto/pote-de-vidro-quadrado-1-3l-vermelho-velvet-invicta-738'
        'http://www.invictaonline.com.br/produto/pote-de-vidro-quadrado-2-0l-vermelho-velvet-invicta-741'
      ),
    ]
  }
}
