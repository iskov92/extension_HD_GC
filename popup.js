document.addEventListener("DOMContentLoaded", function () {
  const badgesSwitch = document.getElementById("badgesEnabled")
  const timeExceededSwitch = document.getElementById("timeExceededEnabled")
  const clientSortingSwitch = document.getElementById("clientSortingEnabled")
  const expandStatusesSwitch = document.getElementById("expandStatusesEnabled")

  // Загружаем сохраненные состояния
  chrome.storage.sync.get(
    [
      "badgesEnabled",
      "timeExceededEnabled",
      "clientSortingEnabled",
      "expandStatusesEnabled",
    ],
    function (result) {
      badgesSwitch.checked = result.badgesEnabled !== false
      timeExceededSwitch.checked = result.timeExceededEnabled !== false
      clientSortingSwitch.checked = result.clientSortingEnabled !== false
      expandStatusesSwitch.checked = result.expandStatusesEnabled !== false
    }
  )

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
