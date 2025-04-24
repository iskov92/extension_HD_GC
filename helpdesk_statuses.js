console.log("Helpdesk statuses script loaded")

// Функция для фильтрации сотрудников
async function filterEmployees() {
  console.log("Начинаем фильтрацию сотрудников...")

  try {
    // Находим поле ввода и эмулируем клик
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

    // Кликаем по полю поиска
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
      console.log("Активировали поле поиска")
    }

    await new Promise((resolve) => setTimeout(resolve, 200))

    // Кликаем по всем иконкам очистки
    const clearIcons = document.querySelectorAll(
      ".v-field .mdi-close-circle.v-icon--clickable"
    )
    clearIcons.forEach((icon) => {
      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
      icon.dispatchEvent(event)
      console.log("Кликнули по иконке очистки")
    })

    console.log("Фильтрация завершена")
  } catch (error) {
    console.error("Ошибка при фильтрации:", error)
  }
}

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
    { text: "Время работы сотрудников", action: () => filterEmployees() },
    { text: "Тест2", action: () => console.log("Тест2") },
    { text: "Тест3", action: () => console.log("Тест3") },
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

observer.observe(document.body, {
  childList: true,
  subtree: true,
})
