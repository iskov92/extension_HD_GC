// Заглушка для функции отслеживания превышения времени работы
console.log("Time exceeded monitoring script loaded")

// Здесь будет основная логика функции
function monitorTimeExceeded() {
  // TODO: Implement time exceeded monitoring logic
}

// Проверяем, включена ли функция
chrome.storage.sync.get(["timeExceededEnabled"], function (result) {
  if (result.timeExceededEnabled !== false) {
    // По умолчанию включено
    monitorTimeExceeded()
  }
})
