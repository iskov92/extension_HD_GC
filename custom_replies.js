// custom_replies.js
;(function () {
  function waitForElement(selector, cb, timeout = 10000) {
    const start = Date.now()
    function check() {
      const el = document.querySelector(selector)
      if (el) return cb(el)
      if (Date.now() - start < timeout) setTimeout(check, 300)
    }
    check()
  }

  function createTemplateButton() {
    const btnsBlock = document.querySelector(
      ".d-flex.justify-end.gap-2.mx-1.mb-2"
    )
    if (!btnsBlock) return
    // Проверяем, нет ли уже нашей кнопки
    if (btnsBlock.querySelector(".custom-template-btn")) return
    const refBtn = Array.from(btnsBlock.querySelectorAll("button")).find(
      (btn) => btn.textContent.trim() === "Отбивки"
    )
    if (!refBtn) return
    // Переопределяем только отступ справа
    refBtn.style.setProperty("margin-right", "8px", "important")
    const templateBtn = refBtn.cloneNode(true)
    templateBtn.classList.add("custom-template-btn")
    templateBtn.querySelector(".v-btn__content").textContent = "Шаблон"
    templateBtn.addEventListener("click", showTemplateOverlay)
    // Устанавливаем максимальный отступ справа
    templateBtn.style.setProperty("margin-right", "auto", "important")
    templateBtn.style.setProperty("margin-left", "0px", "important")
    refBtn.insertAdjacentElement("afterend", templateBtn)
  }

  function showTemplateOverlay() {
    if (document.querySelector(".custom-template-overlay")) return
    // Добавляем стили для .replay-text-block, если ещё не добавлены
    if (!document.getElementById("custom-replay-text-block-style")) {
      const style = document.createElement("style")
      style.id = "custom-replay-text-block-style"
      style.textContent = `
        .custom-template-overlay .replay-text-block {
          margin: 0 0 10px 0;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 15px;
          line-height: 1.25;
          font-family: 'ALS Granate', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
        }
        .custom-template-overlay .replay-text-block:hover {
          background: #e0f7fa;
        }
        .custom-template-overlay {
          opacity: 0;
          background: rgba(0, 0, 0, 0.41)!important;
          transition-duration: .28s;
          transition-property: box-shadow, opacity, background;
          transition-timing-function: cubic-bezier(.4,0,.2,1);
        }
        .custom-template-overlay.visible {
          opacity: 1;
        }
      `
      document.head.appendChild(style)
    }
    const overlay = document.createElement("div")
    overlay.className = "v-overlay__content custom-template-overlay"
    overlay.tabIndex = -1
    overlay.style.position = "fixed"
    overlay.style.zIndex = 9999
    overlay.style.left = 0
    overlay.style.top = 0
    overlay.style.width = "100vw"
    overlay.style.height = "100vh"
    overlay.style.background = "rgba(0,0,0,0.08)"
    overlay.style.display = "flex"
    overlay.style.alignItems = "center"
    overlay.style.justifyContent = "center"
    overlay.innerHTML = `
            <div class="v-card bg-white pa-5" style="width:560px; height:525px; display:flex; flex-direction:column;">
                <div class="text-center"><span class="v-text heading-large">Список шаблонов</span></div>
                <div class="my-6">
                    <p class="replay-text-block cursor-pointer line-height-tight mb-1">Благодарю за оценку и обратную связь по вашему вопросу. Если у вас появятся дополнительные вопросы, пожалуйста, напишите нам. Будем рады помочь.</p>
                    <p class="replay-text-block cursor-pointer line-height-tight mb-1">Благодарю за обратную связь по вашему вопросу. Если у вас появятся дополнительные вопросы, пожалуйста, напишите нам. Будем рады помочь.</p></p>
                    <p class="replay-text-block cursor-pointer line-height-tight mb-1">Для ответа на ваш вопрос потребуется дополнительное время. Пожалуйста, ожидайте ответа.</p>
                </div>
                <div style="margin-top:auto; display:flex; justify-content:flex-end;">
                    <button type="button" class="v-btn v-btn--flat v-theme--lightTheme v-btn--density-compact v-btn--size-default v-btn--variant-elevated text--secondary mr-2 cancel-btn" style="border:1px solid #9e9e9e; color:#9e9e9e; background:transparent;"><span class="v-btn__content">Отмена</span></button>
                </div>
            </div>
        `
    document.body.appendChild(overlay)
    setTimeout(() => overlay.classList.add("visible"), 10)
    // Для плавного скрытия:
    function hideOverlay() {
      overlay.classList.remove("visible")
      setTimeout(() => overlay.remove(), 280)
    }
    overlay.querySelector(".cancel-btn").onclick = hideOverlay
    overlay.querySelectorAll(".replay-text-block").forEach((el) => {
      el.onclick = function () {
        const textarea = document.querySelector(
          ".v-card.bg-white.mx-1.rounded-large.flex-grow-0.flex-shrink-0.mb-1 textarea.v-field__input"
        )
        if (textarea) {
          textarea.value = this.textContent
          textarea.dispatchEvent(new Event("input", { bubbles: true }))
        }
        hideOverlay()
      }
    })
    // Добавляем обработчик для клика вне окна
    overlay.addEventListener("mousedown", function (e) {
      const card = overlay.querySelector(".v-card.bg-white.pa-5")
      if (card && !card.contains(e.target)) {
        hideOverlay()
      }
    })
  }

  function main() {
    chrome.storage.sync.get("customRepliesEnabled", function (data) {
      if (data.customRepliesEnabled === false) return
      waitForElement(
        ".d-flex.justify-end.gap-2.mx-1.mb-2",
        createTemplateButton
      )
    })
  }

  main()
  // Для динамических изменений
  document.addEventListener("DOMContentLoaded", main)
  document.addEventListener("pjax:end", main)
})()
