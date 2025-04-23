console.log("Helpdesk statuses script loaded")

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
        border-radius: 4px;
        box-shadow: 0 2px 6px -1px rgba(0, 0, 0, 0.16);
        padding: 8px 0;
        min-width: 200px;
        display: none;
        z-index: 1000;
    `

  // Добавляем пункты меню (пока пустые, для примера)
  const menuItems = [
    { text: "Тест1", action: () => console.log("Тест1") },
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
