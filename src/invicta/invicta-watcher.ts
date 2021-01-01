import { INotification } from '../core/core'
import { Watcher } from '../core/watcher'
import * as puppeteer from 'puppeteer'

export class InvictaWatcher extends Watcher {
  private product: Product

  constructor(private link: string) {
    super()
  }

  async init(): Promise<void> {
    this.product = await this.getProduct()
  }

  async next(): Promise<INotification> {
    const newProduct = await this.getProduct()
    const state = newProduct.quantity > 0 ? 'available' : 'unavailable'
    this.product = newProduct

    return {
      anyChange: newProduct.quantity != this.product.quantity,
      message: `${this.product.name} is now ${state} with ${this.product.quantity} units at ${this.link}`,
    }
  }

  private async getProduct(): Promise<Product> {
    return await withPuppeteer(async (browser) => {
      const page = await this.openPage(browser)
      const name = await this.getProductName(page)
      const hasAnyProduct = await this.isAvailable(page)

      if (!hasAnyProduct) return { name, quantity: 0 }

      await this.closeCookieMessage(page)
      await this.addProductToCart(page)
      const details = await this.getDetailsFromCart(page)

      return { name, ...details }
    })
  }

  private async openPage(browser: puppeteer.Browser) {
    const page = await browser.newPage()
    await page.goto(this.link)
    await page.waitForTimeout(5000)
    return page
  }

  private async closeCookieMessage(page: puppeteer.Page) {
    await page.click('.MuiButton-label')
  }

  private async getProductName(page: puppeteer.Page) {
    await page.waitForSelector('.product-name')
    return await page.evaluate(() => {
      const nameSpan = document.querySelector('.product-name')
      return nameSpan.innerHTML.trim()
    })
  }

  private async isAvailable(page: puppeteer.Page) {
    const inputCount = await page.evaluate(
      () => document.querySelectorAll('.quantity-input').length
    )
    return inputCount > 0
  }

  private async addProductToCart(page: puppeteer.Page) {
    await page.evaluate(() => {
      const quantityInput = document.querySelector<HTMLInputElement>(
        'input[name=quantity]'
      )
      quantityInput.value = '99'
    })

    await page.waitForTimeout(1000)
    await page.click('.add-to-cart-button span', { button: 'left' })
    await page.waitForTimeout(2000)
  }

  private async getDetailsFromCart(page: puppeteer.Page) {
    const quantity = await page.evaluate(() => {
      const quantityInput = document.querySelector<HTMLInputElement>(
        '.quantity'
      )
      if (!quantityInput) return 0
      return parseInt(quantityInput.value, 10)
    })

    return { quantity }
  }
}

interface Product {
  name: string
  quantity: number
}

async function withPuppeteer<T>(
  callback: (browser: puppeteer.Browser) => Promise<T>
): Promise<T> {
  const browser = await puppeteer.launch()
  try {
    return await callback(browser)
  } catch (ex) {
    throw ex
  } finally {
    browser.close()
  }
}
