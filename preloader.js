console.log("Preloader.js загружен")

// Класс для управления прелоадером
class Preloader {
  constructor() {
    this.preloaderId = "custom-preloader-overlay"
  }

  // Создание HTML элементов прелоадера
  createPreloaderElement() {
    console.log("Создаем элемент прелоадера...")
    const overlay = document.createElement("div")
    overlay.id = this.preloaderId
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      pointer-events: none;
    `

    const spinner = document.createElement("div")
    spinner.style.cssText = `
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #ff8a24;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    `

    // Добавляем keyframes анимацию
    const style = document.createElement("style")
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
    document.head.appendChild(style)

    overlay.appendChild(spinner)
    return overlay
  }

  // Показать прелоадер
  show() {
    console.log("Пытаемся показать прелоадер...")
    const mainElement = document.querySelector(".v-main.d-flex")
    if (!mainElement) {
      console.error("Не найден элемент .v-main.d-flex для прелоадера")
      return
    }

    if (!document.getElementById(this.preloaderId)) {
      console.log("Создаем и добавляем прелоадер...")
      const preloader = this.createPreloaderElement()
      mainElement.style.position = "relative" // Убедимся, что у родителя position relative
      mainElement.appendChild(preloader)
      console.log("Прелоадер добавлен")
    } else {
      console.log("Прелоадер уже существует")
    }
  }

  // Скрыть прелоадер
  hide() {
    console.log("Пытаемся скрыть прелоадер...")
    const preloader = document.getElementById(this.preloaderId)
    if (preloader) {
      preloader.remove()
      console.log("Прелоадер удален")
    } else {
      console.log("Прелоадер не найден для удаления")
    }
  }
}

// Экспортируем экземпляр класса для использования в других скриптах
window.Preloader = new Preloader()
