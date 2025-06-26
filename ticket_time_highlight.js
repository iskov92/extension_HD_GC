// Скрипт для подсветки тикетов по времени и типу
class TicketTimeHighlighter {
  constructor() {
    this.isEnabled = true
    this.observer = null
    this.intervalId = null
    this.checkInterval = 500 // Проверка каждые 500мс
    this.init()
  }

  async init() {
    // Проверяем, включена ли функция
    const result = await chrome.storage.sync.get(["ticketTimeHighlightEnabled"])
    this.isEnabled = result.ticketTimeHighlightEnabled !== false
    if (this.isEnabled) {
      this.start()
    }
  }

  start() {
    console.log(
      "TicketTimeHighlighter: Запуск системы подсветки тикетов по времени"
    )
    this.startObserver()
    this.startPeriodicCheck()
    this.highlightTickets()
  }

  stop() {
    console.log(
      "TicketTimeHighlighter: Остановка системы подсветки тикетов по времени"
    )
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  startObserver() {
    this.observer = new MutationObserver((mutations) => {
      let shouldCheck = false
      mutations.forEach((mutation) => {
        if (
          mutation.type === "childList" &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
        ) {
          const checkNodes = [...mutation.addedNodes, ...mutation.removedNodes]
          checkNodes.forEach((node) => {
            if (node.nodeType === 1) {
              if (
                node.classList?.contains("v-card--ticket") ||
                node.querySelector?.(".v-card--ticket")
              ) {
                shouldCheck = true
              }
            }
          })
        }
        if (mutation.type === "characterData") {
          const parentElement = mutation.target.parentElement
          if (parentElement?.classList?.contains("v-card--ticket")) {
            shouldCheck = true
          }
        }
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          if (mutation.target.classList?.contains("v-card--ticket")) {
            shouldCheck = true
          }
        }
      })
      if (shouldCheck) {
        setTimeout(() => {
          this.highlightTickets()
        }, 50)
      }
    })
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    })
  }

  startPeriodicCheck() {
    this.intervalId = setInterval(() => {
      this.highlightTickets()
    }, this.checkInterval)
  }

  highlightTickets() {
    try {
      const ticketCards = document.querySelectorAll("a.v-card.v-card--ticket")
      const now = this.getMoscowTime()
      ticketCards.forEach((card) => {
        // 1. Найти span с нужным классом (заголовок)
        const titleSpan = card.querySelector(
          "span.v-text.is-truncated.heading-small.text--primary.fw-500"
        )
        if (!titleSpan) return
        const title = titleSpan.textContent.trim().toLowerCase()
        // 2. Найти span с временем
        const timeSpan = card.querySelector(
          "span.v-text.text-default.text-caption[title]"
        )
        if (!timeSpan) return
        const timeText = timeSpan.textContent.trim()
        const ticketTime = this.parseTime(timeText)
        if (!ticketTime) return
        // 3. Сравнить с текущим временем (МСК)
        const diffMinutes = (now - ticketTime) / 60000
        let limit = null
        if (title === "t vip" || title === "t верстка") {
          limit = 30
        } else if (
          title === "t quick list" ||
          title === "t новые" ||
          title === "t база пользователей"
        ) {
          limit = 20
        } else if (title === "t easy") {
          limit = 10
        }
        if (limit !== null && diffMinutes > limit) {
          card.style.setProperty(
            "background",
            "rgb(161, 221, 231)",
            "important"
          )
        } else {
          // Сбросить, если ранее был красный
          const currentBg =
            card.style.background || getComputedStyle(card).background
          if (
            currentBg.includes("#ff0000") ||
            currentBg.includes("rgb(255, 0, 0)") ||
            currentBg.includes("rgb(161, 221, 231)")
          ) {
            card.style.removeProperty("background")
          }
        }
      })
    } catch (error) {
      console.error(
        "TicketTimeHighlighter: Ошибка при подсветке тикетов:",
        error
      )
    }
  }

  // Получить текущее московское время как Date
  getMoscowTime() {
    const now = new Date()
    // UTC+3
    const utc = now.getTime() + now.getTimezoneOffset() * 60000
    return new Date(utc + 3 * 3600000)
  }

  // Парсинг времени из строки HH:mm (возвращает Date с сегодняшней датой)
  parseTime(timeStr) {
    const match = timeStr.match(/^(\d{2}):(\d{2})$/)
    if (!match) return null
    const now = this.getMoscowTime()
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      +match[1],
      +match[2],
      0
    )
    // Если время в будущем (например, после полуночи), считаем, что это вчера
    if (date > now) {
      date.setDate(date.getDate() - 1)
    }
    return date
  }

  // Debug-метод
  debug() {
    const ticketCards = document.querySelectorAll("a.v-card.v-card--ticket")
    console.log("TicketTimeHighlighter Debug:")
    console.log(`Найдено карточек: ${ticketCards.length}`)
    ticketCards.forEach((card, idx) => {
      const titleSpan = card.querySelector(
        "span.v-text.is-truncated.heading-small.text--primary.fw-500"
      )
      const timeSpan = card.querySelector(
        "span.v-text.text-default.text-caption[title]"
      )
      const title = titleSpan?.textContent.trim() || "-"
      const time = timeSpan?.textContent.trim() || "-"
      console.log(`${idx + 1}. ${title} | ${time}`)
    })
  }

  // Сбросить все подсветки
  clearAllHighlights() {
    const ticketCards = document.querySelectorAll("a.v-card.v-card--ticket")
    ticketCards.forEach((card) => {
      card.style.removeProperty("background")
    })
    console.log(
      `TicketTimeHighlighter: Сброшено ${ticketCards.length} карточек`
    )
  }

  // Принудительное обновление
  forceRefresh() {
    console.log("TicketTimeHighlighter: Принудительное обновление")
    this.clearAllHighlights()
    setTimeout(() => {
      this.highlightTickets()
    }, 100)
  }
}

if (typeof chrome !== "undefined" && chrome.storage) {
  const ticketTimeHighlighter = new TicketTimeHighlighter()
  window.TicketTimeHighlighter = ticketTimeHighlighter
}
