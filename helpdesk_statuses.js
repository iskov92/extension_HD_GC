// Helpdesk statuses script

// Функция для фильтрации сотрудников
async function filterEmployees() {
  try {
    // Шаг 1: Клик на выпадающий список стутсов и фильтров
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 2: Очистка полей фильтров и статусов
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

    // Шаг 3: Клик на поле статусов
    const statusField = Array.from(document.querySelectorAll(".v-field")).find(
      (f) => f.querySelector("input")?.placeholder === "Все активные статусы"
    )
    if (statusField) {
      statusField.focus()
      statusField.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 4: Установка нужных статусов в поле статусов
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
          await new Promise((resolve) => setTimeout(resolve, 50))
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 5: Нажатие кнопки "Применить" в окне статусов и фильтров
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 6: ждем загруки поля выбора отделов и нажимаем на него
    const input = document.querySelector(".v-field input")
    if (!input) {
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()

    // Ожидаем появления списка отделов
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

    // еще раз ждем появления списка
    const items = await waitForList()

    if (!items) {
      return
    }

    // Массив нужных названий отделов, которые мы будем отмечать
    const targetTitles = [
      "T Quick list",
      "T База пользователей",
      "T VIP",
      "T Новые",
      "T Верстка",
      "T Easy",
    ]

    // Сначала снимаем все чекбоксы отделов, которые отметили раньше
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
      }
    }

    // ждем после очистки ранее установленных чекбоксов
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Теперь отмечаем нужные, котоыре ранее указали в массиве
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()

        const shouldBeChecked = targetTitles.some(
          (target) => titleText === target
        )
        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
        }
      }
    }

    // Закрываем список с чекбоксами отделов
    input.click()

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Закрываем окно выбора сотрудников через ESC, если оно осталось открытым
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
    // ... existing code ...
  }
}

// Копия функции filterEmployees для AI помощника
// ===== НАЧАЛО СКРИПТА AI ПОМОЩНИК =====
async function aiAssistant() {
  try {
    // Шаг 1: Клик на выпадающий список стутсов и фильтров
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 2: Очистка полей фильтров и статусов
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

    // Шаг 5: Нажатие кнопки "Применить" в окне статусов и фильтров
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 6: ждем загруки поля выбора отделов и нажимаем на него
    const input = document.querySelector(".v-field input")
    if (!input) {
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()

    // Ожидаем появления списка отделов
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

    // еще раз ждем появления списка
    const items = await waitForList()

    if (!items) {
      return
    }

    // Массив нужных названий отделов, которые мы будем отмечать
    const targetTitles = ["AI Помощник"]

    // Сначала снимаем все чекбоксы отделов, которые отметили раньше
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
      }
    }

    // ждем после очистки ранее установленных чекбоксов
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Теперь отмечаем нужные, котоыре ранее указали в массиве
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()

        const shouldBeChecked = targetTitles.some(
          (target) => titleText === target
        )
        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
        }
      }
    }

    // Закрываем список с чекбоксами отделов
    input.click()

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Закрываем окно выбора сотрудников через ESC, если оно осталось открытым
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
    // ... existing code ...
  }
}
// ===== КОНЕЦ СКРИПТА AI ПОМОЩНИК =====

// Копия функции aiAssistant для исполнителей услуг
// ===== НАЧАЛО СКРИПТА S ИСПОЛНИТЕЛИ УСЛУГ =====
async function serviceExecutors() {
  try {
    // Шаг 1: Клик на выпадающий список стутсов и фильтров
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 2: Очистка полей фильтров и статусов
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

    // Шаг 5: Нажатие кнопки "Применить" в окне статусов и фильтров
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 6: ждем загруки поля выбора отделов и нажимаем на него
    const input = document.querySelector(".v-field input")
    if (!input) {
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()

    // Ожидаем появления списка отделов
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

    // еще раз ждем появления списка
    const items = await waitForList()

    if (!items) {
      return
    }

    // Массив нужных названий отделов, которые мы будем отмечать
    const targetTitles = ["S Исполнители платных услуг"]

    // Сначала снимаем все чекбоксы отделов, которые отметили раньше
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
      }
    }

    // ждем после очистки ранее установленных чекбоксов
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Теперь отмечаем нужные, котоыре ранее указали в массиве
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()

        const shouldBeChecked = targetTitles.some(
          (target) => titleText === target
        )
        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
        }
      }
    }

    // Закрываем список с чекбоксами отделов
    input.click()

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Закрываем окно выбора сотрудников через ESC, если оно осталось открытым
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
    // ... existing code ...
  }
}
// ===== КОНЕЦ СКРИПТА S ИСПОЛНИТЕЛИ УСЛУГ =====

// Копия функции filterEmployees для персональных статусов
// ===== НАЧАЛО СКРИПТА МОИ СТАТУСЫ ДЛЯ РАБОТЫ =====
async function myWorkStatuses() {
  try {
    // Шаг 1: Клик на выпадающий список стутсов и фильтров
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 2: Очистка полей фильтров и статусов
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

    // Шаг 3: Клик на поле статусов
    const statusField = Array.from(document.querySelectorAll(".v-field")).find(
      (f) => f.querySelector("input")?.placeholder === "Все ответственные"
    )
    if (statusField) {
      statusField.focus()
      statusField.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг4: Открываем список с ответственными и выбираем нужные
    const targetTexts = ["БЕЗ ОТВЕТСТВЕННОГО", "АНТОН ПИСКОВОЙ"]

    async function scrollAndClickTarget(text) {
      const container = document.querySelector(".v-list") // адаптируй при необходимости
      const step = 300 // было 100 — увеличили
      let maxScrolls = 50

      for (let i = 0; i < maxScrolls; i++) {
        const titleDiv = [
          ...document.querySelectorAll(".v-list-item-title"),
        ].find((div) => div.innerText.trim().toUpperCase() === text)

        if (titleDiv) {
          const parent = titleDiv.closest(".v-list-item")
          const checkbox = parent?.querySelector('input[type="checkbox"]')
          if (checkbox && !checkbox.checked) {
            checkbox.click()
            await new Promise((resolve) => setTimeout(resolve, 100)) // для надёжности после клика
          }
          break
        }

        container.scrollBy(0, step)
        await new Promise((resolve) => setTimeout(resolve, 20)) // было 100 — ускорили
      }
    }

    for (const text of targetTexts) {
      await scrollAndClickTarget(text)
    }

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
      })
    )

    // Шаг 5: Клик на поле статусов
    const statusField1 = Array.from(document.querySelectorAll(".v-field")).find(
      (f) => f.querySelector("input")?.placeholder === "Все активные статусы"
    )
    if (statusField1) {
      statusField1.focus()
      statusField1.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 6: Установка нужных статусов в поле статусов
    const targetTexts1 = ["НОВЫЙ", "ПРИНЯТ", "ЖДЕТ ОТВЕТА", "СМЕНА ОТДЕЛА"]

    for (const text of targetTexts1) {
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

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 7: Нажатие кнопки "Применить" в окне статусов и фильтров
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 8: ждем загруки поля выбора отделов и нажимаем на него
    const input = document.querySelector(".v-field input")
    if (!input) {
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()

    // Ожидаем появления списка отделов
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

    // еще раз ждем появления списка
    const items = await waitForList()

    if (!items) {
      return
    }

    // Массив нужных названий отделов, которые мы будем отмечать
    const targetTitles = ["T Quick list", "T Верстка"]

    // Сначала снимаем все чекбоксы отделов, которые отметили раньше
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
      }
    }

    // ждем после очистки ранее установленных чекбоксов
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Теперь отмечаем нужные, котоыре ранее указали в массиве
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()

        const shouldBeChecked = targetTitles.some(
          (target) => titleText === target
        )
        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
        }
      }
    }

    // Закрываем список с чекбоксами отделов
    input.click()

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Закрываем окно выбора сотрудников через ESC, если оно осталось открытым
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
    // ... existing code ...
  }
}
// ===== КОНЕЦ СКРИПТА МОИ СТАТУСЫ ДЛЯ РАБОТЫ =====

// ===== НАЧАЛО СКРИПТА СТАТУСЫ ДЛЯ ПРОВЕРКИ РАБОТЫ МОЕЙ ГРУППЫ  =====
async function myWorkStatusesGroup() {
  try {
    // Шаг 1: Клик на выпадающий список стутсов и фильтров
    const searchInput = document.querySelector(
      'input[placeholder="Поиск и фильтры"]'
    )
    if (searchInput) {
      searchInput.focus()
      searchInput.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 2: Очистка полей фильтров и статусов
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

    // Шаг 3: Клик на поле статусов
    const statusField = Array.from(document.querySelectorAll(".v-field")).find(
      (f) => f.querySelector("input")?.placeholder === "Все ответственные"
    )
    if (statusField) {
      statusField.focus()
      statusField.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг4: Открываем список с ответственными и выбираем нужные
    const targetTexts = [
      "БЕЗ ОТВЕТСТВЕННОГО",
      "АНАСТАСИЯ КОРОЛЕВА",
      "АНТОН МАНОХИН",
      "ВАДИМ ИЛЬИН",
      "ДАРЬЯ ТОПОРКОВА",
      "ЕВГЕНИЯ ДОРОФЕЕВА",
      "ПОЛИНА СТЕПАНЧУК",
      "СВЕТЛАНА ТЮНЬКОВА",
    ]

    async function scrollAndClickTarget(text) {
      const container = document.querySelector(".v-list") // адаптируй при необходимости
      const step = 200 // было 100 — увеличили
      let maxScrolls = 50

      for (let i = 0; i < maxScrolls; i++) {
        const titleDiv = [
          ...document.querySelectorAll(".v-list-item-title"),
        ].find((div) => div.innerText.trim().toUpperCase() === text)

        if (titleDiv) {
          const parent = titleDiv.closest(".v-list-item")
          const checkbox = parent?.querySelector('input[type="checkbox"]')
          if (checkbox && !checkbox.checked) {
            checkbox.click()
            await new Promise((resolve) => setTimeout(resolve, 50)) // для надёжности после клика
          }
          break
        }

        container.scrollBy(0, step)
        await new Promise((resolve) => setTimeout(resolve, 20)) // было 100 — ускорили
      }
    }

    for (const text of targetTexts) {
      await scrollAndClickTarget(text)
    }

    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
      })
    )

    // Шаг 5: Клик на поле статусов
    const statusField1 = Array.from(document.querySelectorAll(".v-field")).find(
      (f) => f.querySelector("input")?.placeholder === "Все активные статусы"
    )
    if (statusField1) {
      statusField1.focus()
      statusField1.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown" })
      )
    }

    await new Promise((resolve) => setTimeout(resolve, 10))

    // Шаг 6: Установка нужных статусов в поле статусов
    const targetTexts1 = ["НОВЫЙ", "ПРИНЯТ", "ЖДЕТ ОТВЕТА", "СМЕНА ОТДЕЛА"]

    for (const text of targetTexts1) {
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

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 7: Нажатие кнопки "Применить" в окне статусов и фильтров
    const applyButton = [...document.querySelectorAll("button")].find(
      (btn) => btn.innerText.trim().toUpperCase() === "ПРИМЕНИТЬ"
    )

    if (applyButton) {
      applyButton.click()
    }

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Шаг 8: ждем загруки поля выбора отделов и нажимаем на него
    const input = document.querySelector(".v-field input")
    if (!input) {
      return
    }

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }))
    input.focus()

    // Ожидаем появления списка отделов
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

    // еще раз ждем появления списка
    const items = await waitForList()

    if (!items) {
      return
    }

    // Массив нужных названий отделов, которые мы будем отмечать
    const targetTitles = [
      "T Quick list",
      "T База пользователей",
      "T VIP",
      "T Новые",
      "T Верстка",
      "T Easy",
    ]

    // Сначала снимаем все чекбоксы отделов, которые отметили раньше
    for (const item of items) {
      const checkbox = item.querySelector('input[type="checkbox"]')
      if (checkbox && checkbox.checked) {
        checkbox.click()
        await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
      }
    }

    // ждем после очистки ранее установленных чекбоксов
    await new Promise((resolve) => setTimeout(resolve, 50))

    // Теперь отмечаем нужные, котоыре ранее указали в массиве
    for (const item of items) {
      const title = item.querySelector(".v-list-item-title")
      const checkbox = item.querySelector('input[type="checkbox"]')

      if (title && checkbox) {
        const titleText = title.textContent.trim()

        const shouldBeChecked = targetTitles.some(
          (target) => titleText === target
        )
        if (shouldBeChecked && !checkbox.checked) {
          checkbox.click()
          await new Promise((resolve) => setTimeout(resolve, 50)) // Небольшая пауза между кликами
        }
      }
    }

    // Закрываем список с чекбоксами отделов
    input.click()

    await new Promise((resolve) => setTimeout(resolve, 50))

    // Закрываем окно выбора сотрудников через ESC, если оно осталось открытым
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
    // ... existing code ...
  }
}
// ===== КОНЕЦ СКРИПТА СТАТУСЫ ДЛЯ ПРОВЕРКИ РАБОТЫ МОЕЙ ГРУППЫ =====

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
        if (!window.Preloader) {
          return
        }
        try {
          window.Preloader.show()
          await filterEmployees()
        } catch (error) {
          // ... existing code ...
        } finally {
          window.Preloader.hide()
        }
      },
    },
    {
      text: "AI помощник",
      action: async () => {
        if (!window.Preloader) {
          return
        }
        try {
          window.Preloader.show()
          await aiAssistant()
        } catch (error) {
          // ... existing code ...
        } finally {
          window.Preloader.hide()
        }
      },
    },
    {
      text: "S исполнители услуг",
      action: async () => {
        if (!window.Preloader) {
          return
        }
        try {
          window.Preloader.show()
          await serviceExecutors()
        } catch (error) {
          // ... existing code ...
        } finally {
          window.Preloader.hide()
        }
      },
    },
    {
      text: "Мои статусы для работы",
      action: async () => {
        if (!window.Preloader) {
          return
        }
        try {
          window.Preloader.show()
          await myWorkStatuses()
        } catch (error) {
          // ... existing code ...
        } finally {
          window.Preloader.hide()
        }
      },
    },
    {
      text: "Моя группа",
      action: async () => {
        if (!window.Preloader) {
          return
        }
        try {
          window.Preloader.show()
          await myWorkStatusesGroup()
        } catch (error) {
          // ... existing code ...
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
