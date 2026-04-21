import { TemplateEngine } from '@niuxe/template-engine'
import { debounce, extractFormData, copyToClipboard } from './utils'
import './style.css'


(() => {
    document.querySelector('label[for="id_tjm"]').insertAdjacentHTML('afterend', document.getElementById('tplTjm').innerHTML)
    document.querySelector('input[type="range"]').addEventListener('input', e => {
        e.target.nextElementSibling.value = e.target.value
    })
    const engine = new TemplateEngine()

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

    document.querySelectorAll('*[required]').forEach(el => el.removeAttribute('required'))

    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault()
        const data = extractFormData(e.target)
        const formData = new FormData(e.target)

        const text = engine.render(tpl.innerHTML, data)
        copyToClipboard(text)
        formData.append('message_genere', text)
        formData.append('url_source', formData.get('url_source'))  // déjà présent si champ dans form
        formData.append('title', formData.get('title'))
        formData.append('description', formData.get('description'))

        try {
            const response = await fetch(window.location.href, {
                method: e.target.method,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    // 'Content-Type': 'application/json'
                },
                body: formData
            })

            // if (!response.ok) {
            //     const errorData = await response.json()
            //     console.error('❌ Erreur:')
            //     console.error(errorData)
            // }

            const resp_data = await response.json()
            const callout = document.querySelector('.callout')
            const tplCallout = document.getElementById('tplCallout')

            callout.addEventListener('click', e => {
                callout.classList.remove('display')
            })


            if (resp_data.success) {
                // Copie le message dans le presse-papier

                // Reset du formulaire
                e.target.reset()

                // Affiche la notification
                callout.classList.add('success')
                callout.classList.remove('alert')

                callout.querySelector('.content').innerHTML = engine.render(tplCallout.innerHTML, resp_data)

                callout.classList.add('display')

                setTimeout(() => {
                    callout.classList.remove('display')
                }, 2000)

                console.log(`📋 Candidature #${resp_data.candidacy_id} sauvegardée !`)
            } else {
                callout.classList.remove('success')
                callout.classList.add('alert')
                callout.querySelector('.content').innerHTML = engine.render(tplCallout.innerHTML, resp_data)
                callout.classList.add('display')
                setTimeout(() => {
                    callout.classList.remove('display')
                }, 2000)
                return
            }
        } catch (error) {
            console.error('💥 Erreur réseau:', error)
        }
    })
})()