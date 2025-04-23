document.addEventListener("DOMContentLoaded", function () {
  const badgesSwitch = document.getElementById("badgesEnabled")
  const timeExceededSwitch = document.getElementById("timeExceededEnabled")
  const clientSortingSwitch = document.getElementById("clientSortingEnabled")
  const expandStatusesSwitch = document.getElementById("expandStatusesEnabled")
  const themeToggle = document.getElementById("themeToggle")

  // Загружаем сохраненные состояния
  chrome.storage.sync.get(
    [
      "badgesEnabled",
      "timeExceededEnabled",
      "clientSortingEnabled",
      "expandStatusesEnabled",
      "isDarkTheme",
    ],
    function (result) {
      badgesSwitch.checked = result.badgesEnabled !== false
      timeExceededSwitch.checked = result.timeExceededEnabled !== false
      clientSortingSwitch.checked = result.clientSortingEnabled !== false
      expandStatusesSwitch.checked = result.expandStatusesEnabled !== false

      // Устанавливаем тему
      const isDarkTheme = result.isDarkTheme !== false
      themeToggle.checked = !isDarkTheme // инвертируем, так как checked = true означает светлую тему
      document.documentElement.setAttribute(
        "data-theme",
        isDarkTheme ? "dark" : "light"
      )
    }
  )

  // Обработчик переключения темы
  themeToggle.addEventListener("change", function () {
    const isDarkTheme = !this.checked
    document.documentElement.setAttribute(
      "data-theme",
      isDarkTheme ? "dark" : "light"
    )
    chrome.storage.sync.set({ isDarkTheme: isDarkTheme })
  })

  // Обработчики изменения состояния переключателей
  badgesSwitch.addEventListener("change", function () {
    chrome.storage.sync.set({ badgesEnabled: this.checked })
    // Перезагружаем активную вкладку для применения изменений
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id)
      }
    })
  })

  timeExceededSwitch.addEventListener("change", function () {
    chrome.storage.sync.set({ timeExceededEnabled: this.checked })
    // Перезагружаем активную вкладку для применения изменений
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id)
      }
    })
  })

  clientSortingSwitch.addEventListener("change", function () {
    chrome.storage.sync.set({ clientSortingEnabled: this.checked })
    // Перезагружаем активную вкладку для применения изменений
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id)
      }
    })
  })

  expandStatusesSwitch.addEventListener("change", function () {
    chrome.storage.sync.set({ expandStatusesEnabled: this.checked })
    // Перезагружаем активную вкладку для применения изменений
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id)
      }
    })
  })
})
