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
    const templateBtn = refBtn.cloneNode(true)
    templateBtn.classList.add("custom-template-btn")
    templateBtn.querySelector(".v-btn__content").textContent = "Шаблон"
    templateBtn.addEventListener("click", showTemplateOverlay)
    refBtn.parentNode.insertBefore(templateBtn, refBtn.nextSibling)
  }

  function showTemplateOverlay() {
    if (document.querySelector(".custom-template-overlay")) return
    const overlay = document.createElement("div")
    overlay.className = "v-overlay__content custom-template-overlay"
    overlay.tabIndex = -1
    overlay.style.width = "600px"
    overlay.style.position = "fixed"
    overlay.style.zIndex = 9999
    overlay.style.left = "50%"
    overlay.style.top = "20%"
    overlay.style.transform = "translateX(-50%)"
    overlay.innerHTML = `
            <div class="v-card bg-white pa-5">
                <div class="text-center"><span class="v-text heading-large">Список шаблонов</span></div>
                <div class="my-6">
                    <p class="replay-text-block cursor-pointer line-height-tight mb-1">Вариант 1</p>
                    <p class="replay-text-block cursor-pointer line-height-tight mb-1">Вариант 2</p>
                    <p class="replay-text-block cursor-pointer line-height-tight mb-1">Вариант 3</p>
                    <p class="replay-text-block cursor-pointer line-height-tight mb-1">Вариант 4</p>
                </div>
                <div class="flex justify-center">
                    <button type="button" class="v-btn v-btn--flat v-theme--lightTheme v-btn--density-compact v-btn--size-default v-btn--variant-elevated text--secondary mr-2 cancel-btn"><span class="v-btn__content">Отмена</span></button>
                </div>
            </div>
        `
    document.body.appendChild(overlay)
    overlay.querySelector(".cancel-btn").onclick = () => overlay.remove()
    overlay.querySelectorAll(".replay-text-block").forEach((el) => {
      el.onclick = function () {
        const textarea = document.querySelector(
          ".v-card.bg-white.mx-1.rounded-large.flex-grow-0.flex-shrink-0.mb-1 textarea.v-field__input"
        )
        if (textarea) {
          textarea.value = this.textContent
          textarea.dispatchEvent(new Event("input", { bubbles: true }))
        }
        overlay.remove()
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
