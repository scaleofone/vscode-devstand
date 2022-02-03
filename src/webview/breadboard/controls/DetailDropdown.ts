export default function(detailsElement: HTMLDetailsElement) {

    const handleClickOutside = (event: Event) => {
        if (! detailsElement.querySelector('summary').contains(event.target as Node)) {
            detailsElement.open = false
        }
    }

    const toggleClickOutsideListener = (event: Event) => {
        document[
            (event.target as HTMLDetailsElement).open
                ? 'addEventListener'
                : 'removeEventListener'
        ]('click', handleClickOutside, true)
    }

    let recentClickClientX: number
    const rememberRecentClick = (event: MouseEvent) => {
        recentClickClientX = event.clientX
    }

    const changeOrientation = (event: Event) => {
        if ((event.target as HTMLDetailsElement).open) {
            let element: HTMLElement = (event.target as HTMLDetailsElement).querySelector('summary + *')
            if (window.innerWidth - recentClickClientX < 200) {
                element.style.left = 'unset'
                element.style.right = '0'
            } else {
                element.style.right = 'unset'
                element.style.left = '0'
            }
        }
    }

    detailsElement.addEventListener('toggle', toggleClickOutsideListener)
    detailsElement.addEventListener('click', rememberRecentClick)
    detailsElement.addEventListener('toggle', changeOrientation)

    return {
        destroy() {
            detailsElement.removeEventListener('toggle', toggleClickOutsideListener)
            detailsElement.removeEventListener('click', rememberRecentClick)
            detailsElement.removeEventListener('toggle', changeOrientation)
            document.removeEventListener('click', handleClickOutside, true)
        }
    };
}
