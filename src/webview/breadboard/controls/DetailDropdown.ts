export default function(detailsElement: HTMLDetailsElement) {

    const handleClickOutside = (event: MouseEvent) => {
        if (! detailsElement.querySelector('summary').contains(event.target as Node)) {
            detailsElement.open = false
        }
    }
    const setupClickOutsideListener = (event: Event) => {
        if (detailsElement.open) {
            document.addEventListener('click', handleClickOutside, true)
        } else {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }

    const changeOrientation = (event: MouseEvent) => {
        let menuElement: HTMLElement = detailsElement.querySelector('summary + *')
        menuElement.style.opacity = '0'
        setTimeout(() => {
            if (detailsElement.open) {
                if ((event.clientX + menuElement.clientWidth) > window.innerWidth) {
                    menuElement.style.left = 'unset'
                    menuElement.style.right = '0'
                } else {
                    menuElement.style.right = 'unset'
                    menuElement.style.left = '0'
                }
            }
            menuElement.style.opacity = '1'
        }, 1)
    }

    detailsElement.addEventListener('toggle', setupClickOutsideListener)
    detailsElement.addEventListener('click', changeOrientation)

    return {
        destroy() {
            detailsElement.removeEventListener('toggle', setupClickOutsideListener)
            detailsElement.removeEventListener('click', changeOrientation)
            document.removeEventListener('click', handleClickOutside, true)
        }
    };
}
