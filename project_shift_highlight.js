// Скрипт для выделения проектных смен
class ProjectShiftHighlighter {
  constructor() {
    this.isEnabled = true
    this.observer = null
    this.intervalId = null
    this.lastCheck = 0
    this.checkInterval = 500 // Проверка каждые 500мс

    this.init()
  }

  async init() {
    // Проверяем, включена ли функция
    const result = await chrome.storage.sync.get([
      "projectShiftHighlightEnabled",
    ])
    this.isEnabled = result.projectShiftHighlightEnabled !== false

    if (this.isEnabled) {
      this.start()
    }
  }

  start() {
    console.log(
      "ProjectShiftHighlighter: Запуск системы выделения проектных смен"
    )

    // Запускаем MutationObserver для отслеживания изменений DOM
    this.startObserver()

    // Запускаем периодическую проверку как запасной вариант
    this.startPeriodicCheck()

    // Делаем первую проверку сразу
    this.highlightProjectShifts()
  }

  stop() {
    console.log("ProjectShiftHighlighter: Остановка системы выделения")

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
    // Создаем MutationObserver для отслеживания появления новых элементов
    this.observer = new MutationObserver((mutations) => {
      let shouldCheck = false

      mutations.forEach((mutation) => {
        // Отслеживаем добавление/удаление элементов
        if (
          mutation.type === "childList" &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
        ) {
          // Проверяем, добавились или удалились элементы с нужными классами
          const checkNodes = [...mutation.addedNodes, ...mutation.removedNodes]
          checkNodes.forEach((node) => {
            if (node.nodeType === 1) {
              // Element node
              if (
                node.classList?.contains("manager-status") ||
                node.querySelector?.(".manager-status") ||
                node.classList?.contains("v-card") ||
                node.closest?.(".v-virtual-scroll__container")
              ) {
                shouldCheck = true
              }
            }
          })
        }

        // Отслеживаем изменения текста
        if (mutation.type === "characterData") {
          const parentElement = mutation.target.parentElement
          if (parentElement?.classList?.contains("manager-status")) {
            shouldCheck = true
          }
        }

        // Отслеживаем изменения атрибутов (например, стилей)
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          if (mutation.target.classList?.contains("manager-status")) {
            shouldCheck = true
          }
        }
      })

      if (shouldCheck) {
        // Небольшая задержка для завершения всех DOM операций
        setTimeout(() => {
          this.highlightProjectShifts()
        }, 50)
      }
    })

    // Наблюдаем за изменениями в документе с более широкими параметрами
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    })
  }

  startPeriodicCheck() {
    // Периодическая проверка каждые 500мс
    this.intervalId = setInterval(() => {
      this.highlightProjectShifts()
    }, this.checkInterval)
  }

  highlightProjectShifts() {
    try {
      // Ищем все span'ы с классом manager-status
      const managerStatusElements = document.querySelectorAll(".manager-status")

      managerStatusElements.forEach((element) => {
        const text = element.textContent.trim().toLowerCase()

        // Проверяем, содержит ли текст "проектная"
        if (text.includes("проектная")) {
          // Окрашиваем элемент в синий цвет
          element.style.setProperty("background", "#027ffe", "important")
        }
        // Проверяем, содержит ли текст "звонки"
        else if (text.includes("звонки")) {
          // Окрашиваем элемент в фиолетовый цвет
          element.style.setProperty("background", "#8F00FF", "important")
        }
        // Если элемент не соответствует условиям, сбрасываем цвет
        else {
          // Проверяем, был ли элемент ранее окрашен (имеет наши цвета)
          const currentBg =
            element.style.background || getComputedStyle(element).background
          if (
            currentBg.includes("#027ffe") ||
            currentBg.includes("#8F00FF") ||
            currentBg.includes("rgb(2, 127, 254)") ||
            currentBg.includes("rgb(143, 0, 255)")
          ) {
            // Сбрасываем стили
            element.style.removeProperty("background")
            element.style.removeProperty("color")
            element.style.removeProperty("border-radius")
            element.style.removeProperty("padding")
          }
        }
      })
    } catch (error) {
      console.error("ProjectShiftHighlighter: Ошибка при выделении:", error)
    }
  }

  // Метод для отладки - показывает все найденные элементы
  debug() {
    const elements = document.querySelectorAll(".manager-status")
    console.log("ProjectShiftHighlighter Debug:")
    console.log(`Найдено элементов manager-status: ${elements.length}`)

    elements.forEach((el, index) => {
      const text = el.textContent.trim()
      const isProject = text.toLowerCase().includes("проектная")
      const isCalls = text.toLowerCase().includes("звонки")
      console.log(
        `${
          index + 1
        }. Текст: "${text}", Проектная: ${isProject}, Звонки: ${isCalls}`
      )
    })
  }

  // Метод для принудительного сброса всех цветов
  clearAllHighlights() {
    const elements = document.querySelectorAll(".manager-status")
    elements.forEach((element) => {
      element.style.removeProperty("background")
      element.style.removeProperty("color")
      element.style.removeProperty("border-radius")
      element.style.removeProperty("padding")
    })
    console.log(
      `ProjectShiftHighlighter: Сброшено ${elements.length} элементов`
    )
  }

  // Метод для принудительного обновления всех выделений
  forceRefresh() {
    console.log("ProjectShiftHighlighter: Принудительное обновление")
    this.clearAllHighlights()
    setTimeout(() => {
      this.highlightProjectShifts()
    }, 100)
  }
}

// Запускаем только если расширение активно
if (typeof chrome !== "undefined" && chrome.storage) {
  const projectShiftHighlighter = new ProjectShiftHighlighter()

  // Делаем доступным в глобальной области для отладки
  window.ProjectShiftHighlighter = projectShiftHighlighter
}
