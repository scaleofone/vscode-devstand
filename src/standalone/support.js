(() => {

    const data = {
        themes: ['light', 'dark', 'dark-dimmed', 'dark-high-contrast'],
        get currentTheme() {
            return sessionStorage.getItem('theme')
        },
        set currentTheme(theme) {
            sessionStorage.setItem('theme', theme)
            setThemeStylesheet(theme)
        },
    }
    data.currentTheme = data.currentTheme || ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? data.themes[2] : data.themes[0])

    let switcherElement = createSwitcherElement(data.themes, data.currentTheme)
    switcherElement.addEventListener('change', event => data.currentTheme = event.target.value)
    whenBodyIsNotEmpty(() => document.body.appendChild(switcherElement))


    ////////////////////////////////////////////////////////////////////////////


    function createSwitcherElement(themes, currentTheme) {
        let selectElement = document.createElement('select')
        selectElement.setAttribute('style', `
            color: var(--vscode-input-foreground);
            background-color: var(--vscode-input-background);
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            outline :none !important;
            opacity: 0.3;
        `)
        selectElement.innerHTML = themes.reduce((html, theme) => {
            return `${ html } <option value="${ theme }" ${ currentTheme == theme ? 'selected' : '' }>${ theme }</option>`
        }, '')
        return selectElement
    }

    function setThemeStylesheet(theme) {
        let linkElement = document.querySelector('#theme-link')
        if (! linkElement) {
            linkElement = document.createElement('link')
            linkElement.setAttribute('rel', 'stylesheet')
            linkElement.setAttribute('id', 'theme-link')
            linkElement.setAttribute('href', `./theme/${ theme }.css`)
            let firstScriptElement = document.getElementsByTagName('script')[0]
            firstScriptElement.parentElement.insertBefore(linkElement, firstScriptElement)
            return
        }
        linkElement.setAttribute('href', `./theme/${ theme }.css`)
    }

    function whenBodyIsNotEmpty(callback) {
        let interval = setInterval(() => {
            if (document.body.children.length > 0) {
                clearInterval(interval)
                callback()
            }
        }, 50)
    }

})()
