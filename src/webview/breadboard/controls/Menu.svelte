<script>
    import './Menu.css'
    import icon1 from '@vscode/codicons/src/icons/add.svg'
    import icon2 from '@vscode/codicons/src/icons/debug-disconnect.svg'
    import icon3 from '@vscode/codicons/src/icons/symbol-property.svg'
</script>


<div style="padding-top: 105px">

    <div class="menu menu--vertical-padding widget-shadow">
        <div class="menu__item active">
            <span class="shrink-0 inline-flex items-center">{@html icon1}</span>
            <span class="grow truncate">Create new branch...</span>
            <span class="shrink-0">kbd</span>
        </div>
        <div class="menu__item">
            <span class="shrink-0 inline-flex items-center">{@html icon1}</span>
            <span class="grow truncate">
                Create new branch from rea te new bra nch reate new bra nch from
            </span>
            <span class="shrink-0">kbd</span>
        </div>
        <div class="menu__item">
            <span class="shrink-0 inline-flex items-center">{@html icon2}</span>
            Checkout detached...
        </div>
        <div class="menu__item">main</div>
        <div class="menu__item">prettier</div>
    </div>

    <br><br>

    <div class="menu menu--mono widget-shadow">
        <div class="menu__item">
            <span class="shrink-0 inline-flex items-center">{@html icon3}</span>
            <span class="grow truncate">addEventListener</span>
        </div>
        <div class="menu__item">
            <span class="shrink-0 inline-flex items-center">{@html icon3}</span>
            <span class="grow truncate">removeEventListener</span>
        </div>
    </div>
</div>
