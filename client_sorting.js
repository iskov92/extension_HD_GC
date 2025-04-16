/**
 * Фича для определения самостоятельно сортировки
 *
 * Основная логика расширения:
 * 1. Визуальное выделение определенного типа (тикеты с ОП)
 * 2. Автоматическое разворачивание статусов (опция - чекбокс)
 */

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

// Храним ID текущей проверки и таймер
let currentCheckId = 0
let currentTimeout = null

// Функция сброса фона у всех диалогов
function resetAllDialogsBackground() {
  const selector =
    ".justify-end.d-flex.flex-col.flex-grow.overflow-hidden.position-relative.px-2"
  const allDialogs = document.querySelectorAll(selector)
  allDialogs.forEach((dialog) => {
    dialog.style.backgroundColor = ""
  })
}

// Функция для раскрытия всех статусов
async function expandAllStatuses(dialogBox, checkId) {
  const expandButtons = dialogBox.querySelectorAll(".d-flex.cursor-pointer")

  // Проверяем ID перед раскрытием
  if (checkId !== currentCheckId) return

  // Кликаем по всем кнопкам раскрытия только если включена соответствующая опция
  chrome.storage.sync.get(["expandStatusesEnabled"], function (result) {
    if (result.expandStatusesEnabled !== false) {
      expandButtons.forEach((button) => {
        if (checkId === currentCheckId) {
          button.click()
        }
      })
    }
  })

  // Даем время для полной загрузки всех статусов
  await new Promise((resolve) => setTimeout(resolve, 500))
}

// Функция проверки диалогового окна
function checkSupportType() {
  const checkId = ++currentCheckId

  chrome.storage.sync.get(["clientSortingEnabled"], function (result) {
    if (result.clientSortingEnabled !== false) {
      const selector =
        ".justify-end.d-flex.flex-col.flex-grow.overflow-hidden.position-relative.px-2"

      // Проверяем, не была ли запущена новая проверка
      if (checkId !== currentCheckId) return

      waitForElement(selector, 5000)
        .then(async (dialogBox) => {
          // Повторная проверка ID
          if (checkId !== currentCheckId) return

          // Сначала раскрываем все статусы
          await expandAllStatuses(dialogBox, checkId)

          // Проверяем ID после раскрытия статусов
          if (checkId !== currentCheckId) return

          // Ищем все span элементы с классом text--secondary внутри диалога
          const spans = dialogBox.querySelectorAll("span.text--secondary")
          let hasGeneralSupport = false
          let hasSourceNotFound = false

          // Проверяем каждый span
          spans.forEach((span) => {
            const text = span.textContent

            // Проверяем разные варианты написания
            if (
              text.includes("Общая поддержка") ||
              text.includes("Oбщая поддержка") ||
              text.toLowerCase().includes("общая поддержка") ||
              text.toLowerCase().includes("oбщая поддержка")
            ) {
              hasGeneralSupport = true
            }

            // Проверяем наличие текста "источник: Не найден"
            if (text.includes("источник: Не найден")) {
              hasSourceNotFound = true
            }
          })

          // Финальная проверка ID перед применением стилей
          if (checkId === currentCheckId) {
            if (hasGeneralSupport || hasSourceNotFound) {
              dialogBox.style.backgroundColor = ""
            } else {
              dialogBox.style.backgroundColor = "rgba(255, 0, 0, 0.2)"
            }
          }
        })
        .catch(console.error)
    }
  })
}

// Следим за кликами по тикетам
document.addEventListener("click", (event) => {
  if (event.target.closest(".v-virtual-scroll__item")) {
    // Отменяем предыдущий таймаут если он есть
    if (currentTimeout) {
      clearTimeout(currentTimeout)
    }

    // Сразу сбрасываем фон у всех диалогов
    resetAllDialogsBackground()

    // Увеличиваем currentCheckId чтобы прервать текущую проверку если она выполняется
    currentCheckId++

    // Запускаем новую проверку с задержкой
    currentTimeout = setTimeout(() => {
      checkSupportType()
      currentTimeout = null
    }, 1500)
  }
})

// Добавляем стили для разделителей
const style = document.createElement("style")
style.textContent = `
  .client-sorting-section {
    border-top: 1px solid #444;
    border-bottom: 1px solid #444;
    padding: 15px 0;
    margin: 15px 0;
  }
`
document.head.appendChild(style)

// Находим секцию сортировки клиентов и добавляем стили после загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  const clientSortingCheckbox = document.querySelector(
    ".client-sorting-checkbox"
  )
  if (clientSortingCheckbox) {
    const clientSortingSection = clientSortingCheckbox.closest(".v-list-item")
    if (clientSortingSection) {
      // Оборачиваем секцию в div с нужным классом
      const wrapper = document.createElement("div")
      wrapper.className = "client-sorting-section"
      clientSortingSection.parentNode.insertBefore(
        wrapper,
        clientSortingSection
      )
      wrapper.appendChild(clientSortingSection)

      // Добавляем новый чекбокс для разворачивания статусов
      const expandStatusesCheckbox = document.createElement("div")
      expandStatusesCheckbox.className = "v-list-item"
      expandStatusesCheckbox.innerHTML = `
        <div class="v-list-item__content">
          <div class="v-list-item__title">
            <div class="v-input v-input--hide-details v-input--is-label-active v-input--is-dirty theme--light v-input--selection-controls v-input--checkbox">
              <div class="v-input__control">
                <div class="v-input__slot">
                  <div class="v-input--selection-controls__input">
                    <input type="checkbox" class="expand-statuses-checkbox">
                    <div class="v-input--selection-controls__ripple"></div>
                    <i class="v-icon notranslate mdi mdi-checkbox-marked theme--light"></i>
                  </div>
                  <label>Разворачивать статусы</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
      wrapper.appendChild(expandStatusesCheckbox)

      // Добавляем обработчик для нового чекбокса
      const checkbox = expandStatusesCheckbox.querySelector(
        ".expand-statuses-checkbox"
      )
      chrome.storage.sync.get(["expandStatusesEnabled"], function (result) {
        checkbox.checked = result.expandStatusesEnabled !== false
      })
      checkbox.addEventListener("change", function () {
        chrome.storage.sync.set({ expandStatusesEnabled: this.checked })
      })
    }
  }
})
