import { TemplateEngine } from '@niuxe/template-engine'
import { debounce, extractFormData, copyToClipboard, filterTechnos } from './utils'
import './style.css'


(() => {
    document.querySelector('label[for="id_tjm"]').insertAdjacentHTML('afterend', document.getElementById('tplTjm').innerHTML)
    document.querySelector('input[type="range"]').addEventListener('input', e => {
        e.target.nextElementSibling.value = e.target.value
    })

    // Récupère les paramètres GET de l'URL de l'iframe
    const urlParams = new URLSearchParams(window.location.search);
    const sourceUrl = urlParams.get('url') || '';
    const sourceTitle = urlParams.get('title') || '';

    // Remplit les champs du formulaire
    const urlField = document.querySelector('[name="url_source"]');
    const titleField = document.querySelector('[name="title"]');

    if (urlField && sourceUrl) {
        urlField.value = decodeURIComponent(sourceUrl);
    }

    if (titleField && sourceTitle) {
        titleField.value = decodeURIComponent(sourceTitle);
    }


    const engine = new TemplateEngine()

    const search = document.getElementById('search')
    const resetButton = search.nextElementSibling


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