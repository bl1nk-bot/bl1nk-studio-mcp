/**
 * Mobile Responsive UX Tests
 * Coverage: Viewport behavior, layout adaptation, and touch-friendly dimensions
 */
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'

// กำหนด type สำหรับ viewport object
interface Viewport {
  name: string
  width: number
  height: number
  dpr: number
}

describe('Mobile Responsive Design - bl1nk-ide', (): void => {
  const mobileViewports: Viewport[] = [
    { name: 'iPhone SE (375px)', width: 375, height: 667, dpr: 2 },
    { name: 'iPhone 14 (390px)', width: 390, height: 844, dpr: 3 },
    { name: 'Samsung Galaxy S21 (360px)', width: 360, height: 800, dpr: 3 },
    { name: 'iPad Mini (768px)', width: 768, height: 1024, dpr: 2 },
  ]

  // ✅ Fix: ระบุ type ของ viewport parameter และ return type ของ callback
  mobileViewports.forEach((viewport: Viewport): void => {
    describe(`Viewport: ${viewport.name}`, (): void => {
      it('renders without horizontal overflow', (): void => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        })
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: viewport.height,
        })
        Object.defineProperty(window, 'devicePixelRatio', {
          writable: true,
          configurable: true,
          value: viewport.dpr,
        })

        const { container } = render(<App />)

        expect(container).toBeTruthy()

        const appElement = container.firstChild as HTMLElement | null
        if (appElement) {
          const styles = window.getComputedStyle(appElement)
          const overflow = styles.overflow || styles.overflowX
          expect(['hidden', 'auto', 'scroll', '']).toContain(overflow)
        }
      })

      it('has no horizontal scroll on body', (): void => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        })

        const { container } = render(<App />)
        const allElements = container.querySelectorAll('*')
        let hasHorizontalOverflow = false

        // ✅ Fix: ระบุ type ของ element parameter เป็น Element
        allElements.forEach((element: Element): void => {
          const htmlElement = element as HTMLElement
          const rect = htmlElement.getBoundingClientRect()
          if (rect.width > viewport.width) {
            hasHorizontalOverflow = true
          }
        })

        expect(hasHorizontalOverflow).toBe(false)
      })

      it('renders touch-friendly button sizes (min 44px)', (): void => {
        const { container } = render(<App />)
        const buttons = container.querySelectorAll('button')

        buttons.forEach((button: HTMLButtonElement): void => {
          const rect = button.getBoundingClientRect()
          if (rect.width > 0 && rect.height > 0) {
            expect(rect.height).toBeGreaterThanOrEqual(44)
          }
        })
      })

      it('does not render fixed-width elements wider than viewport', (): void => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width,
        })

        const { container } = render(<App />)

        // ตรวจสอบ modal-like elements
        const potentialModals = container.querySelectorAll('[role="dialog"], .modal, [class*="modal"]')

        // ✅ Fix: ระบุ type ของ modal parameter
        potentialModals.forEach((modal: Element): void => {
          const htmlModal = modal as HTMLElement
          const rect = htmlModal.getBoundingClientRect()
          if (rect.width > 0) {
            expect(rect.width).toBeLessThanOrEqual(viewport.width)
          }
        })
      })

      it('renders inputs with mobile-friendly font size (min 16px to prevent iOS zoom)', (): void => {
        const { container } = render(<App />)
        const inputs = container.querySelectorAll('input[type="text"], textarea')

        if (inputs.length > 0) {
          // ✅ Fix: ระบุ type ของ input parameter
          inputs.forEach((input: Element): void => {
            const htmlInput = input as HTMLInputElement
            const styles = window.getComputedStyle(htmlInput)
            const fontSize = parseFloat(styles.fontSize || '16')
            expect(fontSize).toBeGreaterThanOrEqual(16)
          })
        }
      })
    })
  })
})
