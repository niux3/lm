import { TemplateEngine } from '@niuxe/template-engine'
import './style.css'


function debounce(func, wait, immediate, context) {
  var result,
    timeout = null
  return function() {
    var ctx = context || this, args = arguments
    var later = function() {
      timeout = null
      if (!immediate) result = func.apply(ctx, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) result = func.apply(ctx, args)
    return result
  }
}



(() => {
  document.querySelector('input[type="range"]').addEventListener('input', e => {
    e.target.nextElementSibling.value = e.target.value
  })
  const engine = new TemplateEngine()
  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ]

  const technos_sector = {
    "langages": [
      { name: "python", value: "Python" },
      { name: "sql", value: "SQL" },
      { name: "html", value: "HTML" },
      { name: "css", value: "CSS" },
      { name: "javascript", value: "Javascript" },
      { name: "typescript", value: "Typescript" },
    ],
    "annalyse": [
      { name: "numpy", value: "Numpy" },
      { name: "pandas", value: "Pandas" },
      { name: "matplotlib", value: "Matplotlib" },
    ],
    "base de données": [
      { name: "postgresql", value: "PostgreSQL" },
      { name: "mysql", value: "MySQL" },
      { name: "mongodb", value: "MongoDB" },
      { name: "sqlite", value: "SQLite" },
      { name: "redis", value: "Redis" },
    ],
    "backend": [
      { name: "linux", value: "GNU/Linux" },
      { name: "docker", value: "Docker" },
      { name: "celery", value: "Celery" },
      { name: "expressjs", value: "ExpressJS" },
      { name: "django", value: "Django" },
      { name: "drf", value: "Django Rest Framework" },
      { name: "flask", value: "Flask" },
      { name: "flask_rest_full", value: "Flask REST" },
      { name: "fastapi", value: "Fastapi" },
    ],
    "frontend": [
      { name: "a11y", value: "Accessibilité" },
      { name: "seo", value: "SEO" },
      { name: "nodejs", value: "NodeJS" },
      { name: "svelte", value: "Svelte" },
      { name: "sveltekit", value: "Sveltekit" },
      { name: "vuejs", value: "VueJS" },
      { name: "nuxtjs", value: "NuxtJS" },
      { name: "reactjs", value: "ReactJS" },
      { name: "nextjs", value: "NextJS" },
      { name: "astro", value: "Astro" },
    ],
  }

  const tplTechnos = document.getElementById('tplTechno')
  const technoRender = document.getElementById('technoRender')
  technoRender.innerHTML = engine.render(tplTechnos.innerHTML, { technos_sector })

  const search = document.getElementById('search')
  const resetButton = search.nextElementSibling

  const filterTechnos = (searchValue) => {
    const value = searchValue.toLowerCase()

    for (const sector in technos_sector) {
      let hasVisibleTechno = false

      technos_sector[sector].forEach(r => {
        const el = document.getElementById(r.name)
        if (el) {
          const container = el.closest('span')
          const isMatch = r.value.toLowerCase().includes(value)
          container.classList.toggle('hide', !isMatch)
          if (isMatch) hasVisibleTechno = true
        }
      })

      const fieldsets = document.querySelectorAll('#technoRender fieldset')
      fieldsets.forEach(fs => {
        const legend = fs.querySelector('legend')
        if (legend && legend.textContent.toLowerCase() === sector.toLowerCase()) {
          fs.classList.toggle('hide', !hasVisibleTechno)
        }
      })
    }
  }

  search.addEventListener('input', e => {
    debounce(() => filterTechnos(e.target.value), 500)()
  })

  const resetUI = (e) => {
    if (e) e.preventDefault()
    search.value = ""
    filterTechnos("")
    search.focus()
  }

  resetButton.addEventListener('click', resetUI)

  window.addEventListener('keyup', e => {
    if (e.key === "Escape") resetUI(e)
  })

  const tpl = document.getElementById('tplLm')
  const now = new Date()
  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault()
    const form = new FormData(e.target)
    const data = {
      'civility': form.getAll('civility').join(', '),
      'firstname': form.get('firstname'),
      'lastname': form.get('lastname'),
      'status': form.get('status'),
      'position': form.get('position'),
      'contrat': form.get('contrat'),
      'tjm': form.get('tjm'),
      'who': form.get('who'),
      'expertise': form.get('expertise'),
      'techno': form.getAll('techno').join(', '),
      'date': now.getDay() < 15 ? `mi-${months[now.getMonth()].toLocaleLowerCase()}` : `début ${months[(now.getMonth() + 1) % 12].toLocaleLowerCase()}`
    }
    const text = engine.render(tpl.innerHTML, data)
    navigator.clipboard.writeText(text)
    e.target.reset()
    const alert = document.querySelector('.callout')
    alert.classList.add('display')
    let d = setTimeout(() => {
      alert.classList.remove('display')
      clearTimeout(d)
    }, 2000)
  })
})()
