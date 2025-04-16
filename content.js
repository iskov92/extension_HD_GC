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

// Функция кликает на кнопку "Пользователь" в правой карточке
function clickUserTab() {
  chrome.storage.sync.get(["badgesEnabled"], function (result) {
    if (result.badgesEnabled !== false) {
      waitForElement(".block-items-menu .fa.fa-user", 5000)
        .then((button) => {
          button.click()
          processBadges()
        })
        .catch(console.error)
    }
  })
}

// Функция обрабатывает бейджики из правой карточки
function processBadges() {
  waitForElement(".gc-right-active-block", 5000)
    .then((rightPanel) => {
      const accounts = rightPanel.querySelectorAll(
        ".group-item.js-school-auth-link"
      )

      accounts.forEach((account) => {
        const linkTag = account.querySelector("a")
        const url = linkTag?.href
        let badges = [...account.querySelectorAll(".acc-type-label")]
        const linkTagBTag = linkTag.querySelector("b")

        if (!linkTagBTag) {
          badges = badges.filter((badge) => {
            // нам нужно вернуть беэджи в которых нет класса biz-acc
            return !badge.classList.contains("biz-acc")
          })
          addBadgesToDialog(url, badges)
          return
        }

        addBadgesToDialog(url, badges)
      })
    })
    .catch(console.error)
}

// Функция добавляет бейджи рядом со ссылкой в диалоговом окне
function addBadgesToDialog(url, badgeElements) {
  waitForElement(".v-infinite-scroll", 5000)
    .then((dialog) => {
      const links = dialog.querySelectorAll(
        `a[href*='${new URL(url).hostname}']`
      )

      links.forEach((link) => {
        badgeElements.forEach((badge) => {
          const badgeText = badge.textContent.trim()

          // Проверяем, есть ли уже такой бейдж рядом с ссылкой
          if (!link.parentElement.querySelector(`.badge-${badgeText}`)) {
            const clonedBadge = badge.cloneNode(true)
            clonedBadge.classList.add(`badge-${badgeText}`)
            link.insertAdjacentElement("afterend", clonedBadge) // Вставляем сразу после ссылки
          }
        })
      })
    })
    .catch(console.error)
}

// Следим за кликами по тикетам
document.addEventListener("click", (event) => {
  if (event.target.closest(".v-virtual-scroll__item")) {
    setTimeout(clickUserTab, 1000)
  }
})
