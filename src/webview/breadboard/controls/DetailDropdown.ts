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

    detailsElement.addEventListener('toggle', toggleClickOutsideListener)

    return {
        destroy() {
            detailsElement.removeEventListener('toggle', toggleClickOutsideListener)
            document.removeEventListener('click', handleClickOutside, true)
        }
    };
}
