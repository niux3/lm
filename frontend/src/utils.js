export const extractFormData = (form) => {
    const formData = new FormData(form)

    const getLabel = (selector) => {
        const el = form.querySelector(selector)
        if (!el) return ''
        const label = form.querySelector(`label[for="${el.id}"]`)
        return label ? label.textContent.trim() : el.value
    }

    const getCheckboxLabels = (name) => {
        return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`))
            .map(cb => {
                const label = form.querySelector(`label[for="${cb.id}"]`)
                return label ? label.textContent.trim() : cb.value
            }).join(', ')
    }

    const getSelectLabel = (name) => {
        const select = form.querySelector(`select[name="${name}"]`)
        return select?.options[select.selectedIndex]?.text || ''
    }

    return {
        // Noms pour affichage
        civility: getCheckboxLabels('civilities'),
        status: getSelectLabel('status'),
        position: getSelectLabel('position'),
        contract: getSelectLabel('contract'),
        techno: getCheckboxLabels('technologies'),

        // IDs pour la base
        civility_ids: formData.getAll('civilities'),
        status_id: formData.get('status'),
        position_id: formData.get('position'),
        contract_id: formData.get('contract'),
        techno_ids: formData.getAll('technologies'),

        // Champs texte
        firstname: formData.get('firstname') || '',
        lastname: formData.get('lastname') || '',
        tjm: formData.get('tjm') || '0',
        who: formData.get('who') || '',
        expertise: formData.get('expertise') || '',
    }
}


export const debounce = (func, wait, immediate, context) => {
    var result,
        timeout = null
    return function () {
        var ctx = context || this, args = arguments
        var later = function () {
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