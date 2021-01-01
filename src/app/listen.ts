import { notifyNextFactory } from '../core/notify-next'
import { ConsoleNotifier } from '../infrastructure/console-notifier'
import { Notifier } from '../infrastructure/notifier'
import { OSNotifier } from '../infrastructure/os-notifier'
import { Requester } from '../infrastructure/requester'
import { WatcherRepository } from '../infrastructure/watcher-repository'
import { WhatsAppNotifier } from '../infrastructure/whatsapp-notifier'
import * as twilio from 'twilio'
import { Config } from './config'

async function listen() {
  const config = new Config()
  config.start()
  const requester = new Requester()
  const repository = new WatcherRepository(requester)
  const watchers = repository.all()
  const twilioClient = twilio(
    config.whatsApp.accountId,
    config.whatsApp.authToken
  )
  const notifier = new Notifier(
    new ConsoleNotifier(),
    new OSNotifier(),
    new WhatsAppNotifier(twilioClient)
  )
  const notifyNext = await notifyNextFactory(watchers, notifier)

  const tick = async () => {
    await notifyNext()
  }

  await tick()
  setInterval(tick, 15 * 60 * 1000)
}

listen()
