// Helpdesk statuses script

// ===== КОНФИГУРАЦИИ =====
// Объект с настройками для разных вариантов фильтрации
const filterConfigs = {
  // Конфигурация для "Время работы сотрудников"
  employees: {
    responsibleFilter: {
      placeholder: "Все активные статусы",
      targetTexts: ["ВНУТР. ЗАПРОС", "ЖДЕТ ОТВЕТА"],
      needsScrolling: false,
    },
    statusFilter: null,
    departments: [
      "T Quick list",
      "T База пользователей",
      "T VIP",
      "T Новые",
      "T Верстка",
      "T Easy",
    ],
  },

  // Конфигурация для "AI помощник"
  aiAssistant: {
    responsibleFilter: null,
    statusFilter: null,
    departments: ["AI Помощник"],
  },

  // Конфигурация для "S исполнители услуг"
  serviceExecutors: {
    responsibleFilter: null,
    statusFilter: null,
    departments: ["S Исполнители платных услуг"],
  },

  // Конфигурация для "Мои статусы для работы"
  myWorkStatuses: {
    responsibleFilter: {
      placeholder: "Все ответственные",
      targetTexts: ["БЕЗ ОТВЕТСТВЕННОГО", "АНТОН ПИСКОВОЙ"],
      needsScrolling: true,
    },
    statusFilter: {
      placeholder: "Все активные статусы",
      targetTexts: ["НОВЫЙ", "ПРИНЯТ", "ЖДЕТ ОТВЕТА", "СМЕНА ОТДЕЛА"],
      needsScrolling: false,
    },
    departments: ["T Quick list", "T Верстка"],
  },

  // Конфигурация для "Моя группа"
  myWorkStatusesGroup: {
    responsibleFilter: {
      placeholder: "Все ответственные",
      targetTexts: [
        "БЕЗ ОТВЕТСТВЕННОГО",
        "АНАСТАСИЯ КОРОЛЕВА",
        "АНТОН МАНОХИН",
        "ВАДИМ ИЛЬИН",
        "ДАРЬЯ ТОПОРКОВА",
        "ЕВГЕНИЯ ДОРОФЕЕВА",
        "ПОЛИНА СТЕПАНЧУК",
        "СВЕТЛАНА ТЮНЬКОВА",
      ],
      needsScrolling: true,
    },
    statusFilter: {
      placeholder: "Все активные статусы",
      targetTexts: ["НОВЫЙ", "ПРИНЯТ", "ЖДЕТ ОТВЕТА", "СМЕНА ОТДЕЛА"],
      needsScrolling: false,
    },
    departments: [
      "T Quick list",
      "T База пользователей",
      "T VIP",
      "T Новые",
      "T Верстка",
      "T Easy",
    ],
  },
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

// Функция для ожидания появления элемента в DOM
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()
    const check = () => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
      } else if (Date.now() - startTime > timeout) {
        reject(`Элемент ${selector} не найден за ${timeout} мс`)
      } else {
        setTimeout(check, 50)
      }
    }
    check()
  })
}

// Функция для прокрутки и выбора элементов в длинном списке
async function scrollAndClickTarget(
  text,
  containerSelector = ".v-list",
  scrollStep = 200
) {
  const container = document.querySelector(containerSelector)
  let maxScrolls = 50

  for (let i = 0; i < maxScrolls; i++) {
    const titleDiv = [...document.querySelectorAll(".v-list-item-title")].find(
      (div) => div.innerText.trim().toUpperCase() === text
    )

    if (titleDiv) {
      const parent = titleDiv.closest(".v-list-item")
      const checkbox = parent?.querySelector('input[type="checkbox"]')
      if (checkbox && !checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
      break
    }

    container.scrollBy(0, scrollStep)
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
}

// Функция для ожидания списка элементов
async function waitForList() {
  return new Promise((resolve) => {
    let attempts = 0
    const checkList = () => {
      const overlay = document.querySelector(
        ".v-overlay__content.v-autocomplete__content"
      )
      const items = overlay?.querySelectorAll(
        ".v-list-item.respondent-list-item"
      )

      if (overlay && items?.length > 0) {
        resolve(items)
      } else if (attempts < 20) {
        attempts++
        setTimeout(checkList, 30)
      } else {
        resolve(null)
      }
    }
    checkList()
  })
}

// ===== ОСНОВНАЯ ФУНКЦИЯ ФИЛЬТРАЦИИ =====

// Универсальная функция фильтрации, принимающая конфигурацию
async function filterHelpdesk(config) {
  try {
    // Шаг 1: Клик на выпадающий список фильтров
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
    }
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 2: Очистка полей фильтров
    const fields = document.querySelectorAll(
      ".v-field.v-field--active.v-field--appended.v-field--center-affix.v-field--dirty.v-field--persistent-clear.v-field--no-label.v-field--variant-outlined.v-theme--lightTheme.v-locale--is-ltr"
    )
    fields.forEach((field) => {
      const clearIcon = field.querySelector(".mdi-close-circle")
      if (clearIcon) {
        clearIcon.click()
      }
    })
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 3: Обработка фильтра по ответственным (если указан)
    if (config.responsibleFilter) {
      await applyFilter(config.responsibleFilter)

      // Закрываем меню ответственных по ESC
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          code: "Escape",
          keyCode: 27,
          which: 27,
          bubbles: true,
        })
      )
      await new Promise((resolve) => setTimeout(resolve, 30))
    }

    // Шаг 4: Обработка фильтра по статусам (если указан)
    if (config.statusFilter) {
      await applyFilter(config.statusFilter)
    }

    // Шаг 5: Нажатие кнопки "Применить"
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
    }
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 6: Обработка выбора отделов
    const input = document.querySelector(".v-field input")
    if (!input) {
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()

    // Ждем появления списка
    const items = await waitForList()
    if (!items) {
      return
    }

    // Сначала снимаем все чекбоксы
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 30))
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Затем отмечаем нужные отделы
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()
        const shouldBeChecked = config.departments.some(
          (target) => titleText === target
        )

        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 30))
        }
      }
    }

    // Закрываем список с чекбоксами отделов
    input.click()
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Закрываем окно выбора через ESC, если оно осталось открытым
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
      })
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
  } catch (error) {
    // Игнорируем ошибки
  }
}

// Функция для применения фильтра
async function applyFilter(filterConfig) {
  // Находим и кликаем на поле фильтра
  const filterField = Array.from(document.querySelectorAll(".v-field")).find(
    (f) => f.querySelector("input")?.placeholder === filterConfig.placeholder
  )

  if (filterField) {
    filterField.focus()
    filterField.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown" })
    )
  }
  await new Promise((resolve) => setTimeout(resolve, 50))

  // Выбираем нужные значения
  if (filterConfig.needsScrolling) {
    // Если нужна прокрутка для поиска элементов
    for (const text of filterConfig.targetTexts) {
      await scrollAndClickTarget(text)
    }
  } else {
    // Если прокрутка не нужна
    for (const text of filterConfig.targetTexts) {
      const titleDiv = [
        ...document.querySelectorAll(".v-list-item-title"),
      ].find((div) => div.innerText.trim().toUpperCase() === text)

      if (titleDiv) {
        const parent = titleDiv.closest(".v-list-item")
        const checkbox = parent?.querySelector('input[type="checkbox"]')
        if (checkbox && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 50))
}

// ===== ПУБЛИЧНЫЕ ФУНКЦИИ ДЛЯ ВЫЗОВА =====

// Функция для фильтрации сотрудников
async function filterEmployees() {
  await filterHelpdesk(filterConfigs.employees)
}

// Функция для фильтрации AI помощника
async function aiAssistant() {
  await filterHelpdesk(filterConfigs.aiAssistant)
}

// Функция для фильтрации S исполнителей услуг
async function serviceExecutors() {
  await filterHelpdesk(filterConfigs.serviceExecutors)
}

// Функция для фильтрации "Мои статусы для работы"
async function myWorkStatuses() {
  await filterHelpdesk(filterConfigs.myWorkStatuses)
}

// Функция для фильтрации "Моя группа"
async function myWorkStatusesGroup() {
  await filterHelpdesk(filterConfigs.myWorkStatusesGroup)
}

// ===== ФУНКЦИИ ДЛЯ СОЗДАНИЯ И ОТОБРАЖЕНИЯ UI =====

// Функция для создания кнопки статусов
function createStatusButton() {
  const button = document.createElement("div")
  button.className = "status-button"
  button.style.cssText = `
        width: 30px;
        height: 30px;
        margin: 2px 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #9E9E9E;
        border-radius: 4px;
        background-color: #9E9E9E;
    `

  // Добавляем иконку
  const icon = document.createElement("img")
  icon.src = chrome.runtime.getURL("icons/Slider_02.svg")
  icon.style.width = "20px"
  icon.style.height = "20px"
  button.appendChild(icon)

  // Создаем контекстное меню
  const contextMenu = document.createElement("div")
  contextMenu.className = "status-context-menu"
  contextMenu.style.cssText = `
        position: absolute;
        left: 100%;
        top: 0;
        background: white;
        border: 1px solid #ff8a24;
        border-radius: 4px;
        box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.16);
        padding: 8px 0;
        min-width: 300px;
        display: none;
        z-index: 1000;
    `

  // Добавляем кнопки в контекстное меню
  const menuItems = [
    {
      text: "Время работы сотрудников",
      action: async () => {
        if (!window.Preloader) return
        try {
          window.Preloader.show()
          await filterEmployees()
        } catch (error) {
          // Игнорируем ошибки
        } finally {
          window.Preloader.hide()
        }
      },
    },
    {
      text: "AI помощник",
      action: async () => {
        if (!window.Preloader) return
        try {
          window.Preloader.show()
          await aiAssistant()
        } catch (error) {
          // Игнорируем ошибки
        } finally {
          window.Preloader.hide()
        }
      },
    },
    {
      text: "S исполнители услуг",
      action: async () => {
        if (!window.Preloader) return
        try {
          window.Preloader.show()
          await serviceExecutors()
        } catch (error) {
          // Игнорируем ошибки
        } finally {
          window.Preloader.hide()
        }
      },
    },
    {
      text: "Мои статусы для работы",
      action: async () => {
        if (!window.Preloader) return
        try {
          window.Preloader.show()
          await myWorkStatuses()
        } catch (error) {
          // Игнорируем ошибки
        } finally {
          window.Preloader.hide()
        }
      },
    },
    {
      text: "Моя группа",
      action: async () => {
        if (!window.Preloader) return
        try {
          window.Preloader.show()
          await myWorkStatusesGroup()
        } catch (error) {
          // Игнорируем ошибки
        } finally {
          window.Preloader.hide()
        }
      },
    },
  ]

  menuItems.forEach((item) => {
    const menuItem = document.createElement("div")
    menuItem.className = "status-menu-item"
    menuItem.style.cssText = `
            padding: 8px 16px;
            cursor: pointer;
            color: var(--lt-color-gray-700);
            font-family: ALS Granate, sans-serif;
            font-size: 14px;
        `
    menuItem.textContent = item.text
    menuItem.addEventListener("click", (e) => {
      e.stopPropagation()
      item.action()
      contextMenu.style.display = "none"
    })
    menuItem.addEventListener("mouseover", () => {
      menuItem.style.backgroundColor = "var(--lt-color-gray-200)"
    })
    menuItem.addEventListener("mouseout", () => {
      menuItem.style.backgroundColor = ""
    })
    contextMenu.appendChild(menuItem)
  })

  // Создаем контейнер для кнопки и меню
  const container = document.createElement("div")
  container.style.position = "relative"
  container.appendChild(button)
  container.appendChild(contextMenu)

  // Добавляем обработчики для показа/скрытия меню
  button.addEventListener("click", (e) => {
    e.preventDefault()
    e.stopPropagation()
    const isVisible = contextMenu.style.display === "block"
    contextMenu.style.display = isVisible ? "none" : "block"
  })

  // Закрываем меню при клике вне его
  document.addEventListener("click", () => {
    contextMenu.style.display = "none"
  })

  return container
}

// Функция для добавления кнопки на страницу
function addStatusButtonToPage() {
  // Проверяем URL
  if (!window.location.href.includes("getcourse.ru/pl/helpdesk")) {
    return
  }

  chrome.storage.sync.get(["timeExceededEnabled"], function (result) {
    if (result.timeExceededEnabled === false) {
      // Если опция выключена, удаляем существующую кнопку если она есть
      const existingButton = document.querySelector(".status-button")
      if (existingButton) {
        existingButton.closest("div").remove()
      }
      return
    }

    const buttonContainer = document.querySelector(
      ".flex.flex-col.items-center.bg-white.h-screen.rounded-small.py-1"
    )

    if (buttonContainer && !buttonContainer.querySelector(".status-button")) {
      const statusButtonContainer = createStatusButton()
      buttonContainer.appendChild(statusButtonContainer)
    }
  })
}

// Добавляем кнопку при загрузке страницы
addStatusButtonToPage()

// И следим за изменениями DOM
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      addStatusButtonToPage()
    }
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
