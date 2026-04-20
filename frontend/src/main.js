import { TemplateEngine } from '@niuxe/template-engine'
import { debounce, extractFormData } from './utils'
import './style.css'


(() => {
    document.querySelector('label[for="id_tjm"]').insertAdjacentHTML('afterend', document.getElementById('tplTjm').innerHTML)
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

    const search = document.getElementById('search')
    const resetButton = search.nextElementSibling

    const filterTechnos = (searchValue) => {
        const value = searchValue.toLowerCase()

        // Récupère tous les fieldsets de technologies
        const fieldsets = technoRender.querySelectorAll('fieldset.fieldset')

        fieldsets.forEach(fieldset => {
            let hasVisibleTechno = false

            // Récupère tous les spans contenant les checkboxes
            const spans = fieldset.querySelectorAll('span')

            spans.forEach(span => {
                const label = span.querySelector('label')
                if (label) {
                    const labelText = label.textContent.toLowerCase()
                    const isMatch = labelText.includes(value)

                    // Cache ou affiche le span
                    span.classList.toggle('hide', !isMatch)

                    if (isMatch) {
                        hasVisibleTechno = true
                    }
                }
            })

            // Cache ou affiche le fieldset entier
            fieldset.classList.toggle('hide', !hasVisibleTechno)
        })
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

    document.querySelectorAll('*[required]').forEach(el => el.removeAttribute('required'))

    document.querySelector('form').addEventListener('submit', e => {
        e.preventDefault()
        const data = extractFormData(e.target)
        // const form = new FormData(e.target)
        // form.set('civilities', form.getAll('civilities').join(', '))
        // form.set('techno', form.getAll('techno').join(', '))
        // form.append('date', now.getDate() < 15 ? `mi-${months[now.getMonth()].toLocaleLowerCase()}` : `début ${months[(now.getMonth() + 1) % 12].toLocaleLowerCase()}`)
        // form.append('url', window.location.href)
        console.table(data)

        // const text = engine.render(tpl.innerHTML, Object.fromEntries(form))
        // navigator.clipboard.writeText(text)
        e.target.reset()
        const alert = document.querySelector('.callout')
        alert.classList.add('display')
        let d = setTimeout(() => {
            alert.classList.remove('display')
            clearTimeout(d)
        }, 2000)
    })
})()