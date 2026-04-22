// content.js
let iframeContainer = null;

function createIframeContainer(url, title) {
    // Si l'iframe existe déjà, on l'affiche simplement
    if (iframeContainer) {
        iframeContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        return;
    }

    // Sinon, on la crée (première ouverture)
    const currentUrl = url || window.location.href;
    const currentTitle = title || document.title;

    iframeContainer = document.createElement('div');
    iframeContainer.id = 'lm-extension-container';
    iframeContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2147483647;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow-y: auto;
    `;

    // Bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #ff4136;
        color: white;
        border: none;
        font-size: 24px;
        cursor: pointer;
        z-index: 2147483648;
    `;
    closeButton.onclick = hideIframe;

    // L'iframe (créée une seule fois)
    const iframe = document.createElement('iframe');
    iframe.id = 'lm-extension-iframe';
    iframe.src = `http://lm.tld?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(currentTitle)}`;
    iframe.style.cssText = `
        width: 90%;
        max-width: 1400px;
        min-height: 100vh;
        border: none;
        background: white;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        margin: 20px auto;
        border-radius: 8px;
    `;

    iframeContainer.appendChild(closeButton);
    iframeContainer.appendChild(iframe);
    document.body.appendChild(iframeContainer);
    document.body.style.overflow = 'hidden';
}

function hideIframe() {
    if (iframeContainer) {
        // Cache sans supprimer
        iframeContainer.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Notifie le background que l'iframe est cachée
    browser.runtime.sendMessage({ action: 'iframeHidden' });
}

// Écoute les messages du background
browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'showIframe') {
        createIframeContainer(message.url, message.title);
    }
    if (message.action === 'hideIframe') {
        hideIframe();
    }
});