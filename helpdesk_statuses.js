console.log("Helpdesk statuses script loaded")

// Функция для фильтрации сотрудников
async function filterEmployees() {
  console.log("Начинаем фильтрацию...")

  try {
    // Шаг 1: Активация поля поиска
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
      console.log("Активировали поле поиска")
    }

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Шаг 2: Очистка полей фильтров
    const fields = document.querySelectorAll(
      ".v-field.v-field--active.v-field--appended.v-field--center-affix.v-field--dirty.v-field--persistent-clear.v-field--no-label.v-field--variant-outlined.v-theme--lightTheme.v-locale--is-ltr"
    )
    fields.forEach((field) => {
      const clearIcon = field.querySelector(".mdi-close-circle")
      if (clearIcon) {
        clearIcon.click()
        console.log("Очистка поля выполнена")
      }
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Шаг 3: Активация поля статусов
    const statusField = Array.from(document.querySelectorAll(".v-field")).find(
      (f) => f.querySelector("input")?.placeholder === "Все активные статусы"
    )
    if (statusField) {
      statusField.focus()
      statusField.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Шаг 4: Установка нужных статусов
    const targetTexts = ["ВНУТР. ЗАПРОС", "ЖДЕТ ОТВЕТА"]

    for (const text of targetTexts) {
      const titleDiv = [
        ...document.querySelectorAll(".v-list-item-title"),
      ].find((div) => div.innerText.trim().toUpperCase() === text)

      if (titleDiv) {
        const parent = titleDiv.closest(".v-list-item")
        const checkbox = parent?.querySelector('input[type="checkbox"]')
        if (checkbox && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 300))
          console.log(`Установлен чекбокс статуса: ${text}`)
        }
      } else {
        console.warn(`Не нашли чекбокс статуса с текстом: ${text}`)
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Шаг 5: Нажатие кнопки "Применить"
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
      console.log("Кнопка 'Применить' нажата")
    } else {
      console.warn("Кнопка 'Применить' не найдена")
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Шаг 6: Основная логика фильтрации сотрудников
    const input = document.querySelector(".v-field input")
    if (!input) {
      console.error("Поле ввода не найдено")
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()
    console.log("Активировали поле ввода")

    // Функция для ожидания появления списка
    const waitForList = () => {
      return new Promise((resolve) => {
        let attempts = 0
        const checkList = () => {
          const overlay = document.querySelector(
            ".v-overlay__content.v-autocomplete__content"
          )
          const items = overlay?.querySelectorAll(
            ".v-list-item.respondent-list-item"
          )
          console.log(
            `Попытка ${attempts + 1}: найдено элементов списка: ${
              items?.length || 0
            }`
          )

          if (overlay && items?.length > 0) {
            resolve(items)
          } else if (attempts < 20) {
            attempts++
            setTimeout(checkList, 100)
          } else {
            resolve(null)
          }
        }
        checkList()
      })
    }

    // Ждем появления списка
    console.log("Ждем появления списка...")
    const items = await waitForList()

    if (!items) {
      console.error("Список не появился после нескольких попыток")
      return
    }

    console.log("Список найден, начинаем обработку элементов")

    // Массив нужных названий
    const targetTitles = [
      "T Quick list",
      "T База пользователей",
      "T VIP",
      "T Новые",
      "T Верстка",
      "T Easy",
    ]

    // Сначала снимаем все чекбоксы
    console.log("Снимаем все чекбоксы...")
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
        console.log("Снят чекбокс")
      }
    }

    // Небольшая пауза после снятия чекбоксов
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Теперь отмечаем нужные
    console.log("Отмечаем нужные чекбоксы...")
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()
        console.log(`Проверяем элемент: ${titleText}`)

        const shouldBeChecked = targetTitles.some(
          (target) => titleText === target
        )
        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
          console.log(`Отмечен: ${titleText}`)
        }
      }
    }

    // Закрываем список кликом по полю ввода
    input.click()
    console.log("Закрыли список")

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Закрываем окно выбора сотрудников через ESC
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
      })
    )
    console.log("Отправлен ESC для закрытия окна")

    await new Promise((resolve) => setTimeout(resolve, 200))

    console.log("Фильтрация завершена")
  } catch (error) {
    console.error("Ошибка при фильтрации:", error)
  }
}

// Копия функции filterEmployees для AI помощника
// ===== НАЧАЛО СКРИПТА AI ПОМОЩНИК =====
async function aiAssistant() {
  console.log("Начинаем фильтрацию...")

  try {
    // Шаг 1: Активация поля поиска
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
      console.log("Активировали поле поиска")
    }

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Шаг 2: Очистка полей фильтров
    const fields = document.querySelectorAll(
      ".v-field.v-field--active.v-field--appended.v-field--center-affix.v-field--dirty.v-field--persistent-clear.v-field--no-label.v-field--variant-outlined.v-theme--lightTheme.v-locale--is-ltr"
    )
    fields.forEach((field) => {
      const clearIcon = field.querySelector(".mdi-close-circle")
      if (clearIcon) {
        clearIcon.click()
        console.log("Очистка поля выполнена")
      }
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Шаг 5: Нажатие кнопки "Применить"
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
      console.log("Кнопка 'Применить' нажата")
    } else {
      console.warn("Кнопка 'Применить' не найдена")
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Шаг 6: Основная логика фильтрации сотрудников
    const input = document.querySelector(".v-field input")
    if (!input) {
      console.error("Поле ввода не найдено")
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()
    console.log("Активировали поле ввода")

    // Функция для ожидания появления списка
    const waitForList = () => {
      return new Promise((resolve) => {
        let attempts = 0
        const checkList = () => {
          const overlay = document.querySelector(
            ".v-overlay__content.v-autocomplete__content"
          )
          const items = overlay?.querySelectorAll(
            ".v-list-item.respondent-list-item"
          )
          console.log(
            `Попытка ${attempts + 1}: найдено элементов списка: ${
              items?.length || 0
            }`
          )

          if (overlay && items?.length > 0) {
            resolve(items)
          } else if (attempts < 20) {
            attempts++
            setTimeout(checkList, 100)
          } else {
            resolve(null)
          }
        }
        checkList()
      })
    }

    // Ждем появления списка
    console.log("Ждем появления списка...")
    const items = await waitForList()

    if (!items) {
      console.error("Список не появился после нескольких попыток")
      return
    }

    console.log("Список найден, начинаем обработку элементов")

    // Массив нужных названий
    const targetTitles = ["AI Помощник"]

    // Сначала снимаем все чекбоксы
    console.log("Снимаем все чекбоксы...")
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
        console.log("Снят чекбокс")
      }
    }

    // Небольшая пауза после снятия чекбоксов
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Теперь отмечаем нужные
    console.log("Отмечаем нужные чекбоксы...")
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()
        console.log(`Проверяем элемент: ${titleText}`)

        const shouldBeChecked = targetTitles.some(
          (target) => titleText === target
        )
        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
          console.log(`Отмечен: ${titleText}`)
        }
      }
    }

    // Закрываем список кликом по полю ввода
    input.click()
    console.log("Закрыли список")

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Закрываем окно выбора сотрудников через ESC
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
      })
    )
    console.log("Отправлен ESC для закрытия окна")

    await new Promise((resolve) => setTimeout(resolve, 200))

    console.log("Фильтрация завершена")
  } catch (error) {
    console.error("Ошибка при фильтрации:", error)
  }
}
// ===== КОНЕЦ СКРИПТА AI ПОМОЩНИК =====

// Копия функции aiAssistant для исполнителей услуг
// ===== НАЧАЛО СКРИПТА S ИСПОЛНИТЕЛИ УСЛУГ =====
async function serviceExecutors() {
  console.log("Начинаем фильтрацию...")

  try {
    // Шаг 1: Активация поля поиска
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
      console.log("Активировали поле поиска")
    }

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Шаг 2: Очистка полей фильтров
    const fields = document.querySelectorAll(
      ".v-field.v-field--active.v-field--appended.v-field--center-affix.v-field--dirty.v-field--persistent-clear.v-field--no-label.v-field--variant-outlined.v-theme--lightTheme.v-locale--is-ltr"
    )
    fields.forEach((field) => {
      const clearIcon = field.querySelector(".mdi-close-circle")
      if (clearIcon) {
        clearIcon.click()
        console.log("Очистка поля выполнена")
      }
    })

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Шаг 5: Нажатие кнопки "Применить"
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
      console.log("Кнопка 'Применить' нажата")
    } else {
      console.warn("Кнопка 'Применить' не найдена")
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Шаг 6: Основная логика фильтрации сотрудников
    const input = document.querySelector(".v-field input")
    if (!input) {
      console.error("Поле ввода не найдено")
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()
    console.log("Активировали поле ввода")

    // Функция для ожидания появления списка
    const waitForList = () => {
      return new Promise((resolve) => {
        let attempts = 0
        const checkList = () => {
          const overlay = document.querySelector(
            ".v-overlay__content.v-autocomplete__content"
          )
          const items = overlay?.querySelectorAll(
            ".v-list-item.respondent-list-item"
          )
          console.log(
            `Попытка ${attempts + 1}: найдено элементов списка: ${
              items?.length || 0
            }`
          )

          if (overlay && items?.length > 0) {
            resolve(items)
          } else if (attempts < 20) {
            attempts++
            setTimeout(checkList, 100)
          } else {
            resolve(null)
          }
        }
        checkList()
      })
    }

    // Ждем появления списка
    console.log("Ждем появления списка...")
    const items = await waitForList()

    if (!items) {
      console.error("Список не появился после нескольких попыток")
      return
    }

    console.log("Список найден, начинаем обработку элементов")

    // Массив нужных названий
    const targetTitles = ["S Исполнители платных услуг"]

    // Сначала снимаем все чекбоксы
    console.log("Снимаем все чекбоксы...")
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
        console.log("Снят чекбокс")
      }
    }

    // Небольшая пауза после снятия чекбоксов
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Теперь отмечаем нужные
    console.log("Отмечаем нужные чекбоксы...")
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()
        console.log(`Проверяем элемент: ${titleText}`)

        const shouldBeChecked = targetTitles.some(
          (target) => titleText === target
        )
        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
          console.log(`Отмечен: ${titleText}`)
        }
      }
    }

    // Закрываем список кликом по полю ввода
    input.click()
    console.log("Закрыли список")

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Закрываем окно выбора сотрудников через ESC
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
      })
    )
    console.log("Отправлен ESC для закрытия окна")

    await new Promise((resolve) => setTimeout(resolve, 200))

    console.log("Фильтрация завершена")
  } catch (error) {
    console.error("Ошибка при фильтрации:", error)
  }
}
// ===== КОНЕЦ СКРИПТА S ИСПОЛНИТЕЛИ УСЛУГ =====

// Функция ожидания появления элемента в DOM
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
        setTimeout(check, 500)
      }
    }
    check()
  })
}

// Функция для создания кнопки статусов
function createStatusButton() {
  console.log("Создаем кнопку статусов...")
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
        border: 1px solid #ff8a24;
        border-radius: 4px;
    `

  // Добавляем иконку
  const icon = document.createElement("img")
  icon.src = chrome.runtime.getURL("icons/Slider_02.svg")
  icon.style.width = "16px"
  icon.style.height = "16px"
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
        min-width: 200px;
        display: none;
        z-index: 1000;
    `

  // Добавляем пункты меню
  const menuItems = [
    {
      text: "Время работы сотрудников",
      action: async () => {
        console.log("Клик по пункту меню 'Время работы сотрудников'")
        if (!window.Preloader) {
          console.error(
            "Preloader не найден! Проверьте подключение preloader.js"
          )
          return
        }
        try {
          console.log("Пробуем показать прелоадер...")
          window.Preloader.show()
          console.log("Запускаем filterEmployees...")
          await filterEmployees()
          console.log("filterEmployees завершен")
        } catch (error) {
          console.error("Ошибка в обработчике меню:", error)
        } finally {
          console.log("Скрываем прелоадер в finally блоке")
          window.Preloader.hide()
        }
      },
    },
    {
      text: "AI помощник",
      action: async () => {
        console.log("Клик по пункту меню 'AI помощник'")
        if (!window.Preloader) {
          console.error(
            "Preloader не найден! Проверьте подключение preloader.js"
          )
          return
        }
        try {
          console.log("Пробуем показать прелоадер...")
          window.Preloader.show()
          console.log("Запускаем aiAssistant...")
          await aiAssistant()
          console.log("aiAssistant завершен")
        } catch (error) {
          console.error("Ошибка в обработчике меню:", error)
        } finally {
          console.log("Скрываем прелоадер в finally блоке")
          window.Preloader.hide()
        }
      },
    },
    {
      text: "S исполнители услуг",
      action: async () => {
        console.log("Клик по пункту меню 'S исполнители услуг'")
        if (!window.Preloader) {
          console.error(
            "Preloader не найден! Проверьте подключение preloader.js"
          )
          return
        }
        try {
          console.log("Пробуем показать прелоадер...")
          window.Preloader.show()
          console.log("Запускаем serviceExecutors...")
          await serviceExecutors()
          console.log("serviceExecutors завершен")
        } catch (error) {
          console.error("Ошибка в обработчике меню:", error)
        } finally {
          console.log("Скрываем прелоадер в finally блоке")
          window.Preloader.hide()
        }
      },
    },
  ]

  menuItems.forEach((item) => {
    console.log(`Создаем пункт меню: ${item.text}`)
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
      console.log("Найден контейнер для кнопки, добавляем...")
      const statusButtonContainer = createStatusButton()
      buttonContainer.appendChild(statusButtonContainer)
      console.log("Кнопка добавлена успешно")
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
1
observer.observe(document.body, {
  childList: true,
  subtree: true,
})
