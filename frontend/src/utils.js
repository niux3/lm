export const extractFormData = (form) => {
    const now = new Date()
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
        date: now.getDate() < 15 ? `mi-${months[now.getMonth()].toLocaleLowerCase()}` : `début ${months[(now.getMonth() + 1) % 12].toLocaleLowerCase()}`,
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

export const copyToClipboard = (text) => {
    try {
        // Méthode moderne (HTTPS ou localhost)
        navigator.clipboard.writeText(text);
    } catch (err) {
        // Fallback pour HTTP sur domaines personnalisés
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}