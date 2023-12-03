import { ItemManager } from "./classes/ItemManager"

export function buildThemeMenu() {
    const themes = ["light", "retro", "dark", "coffee"]
    const previews = ['primary', 'secondary', 'accent']
    const root = document.documentElement
    const selectedTheme = root.dataset.theme
    const themeMenu = document.getElementById('themeMenu')

    themes.forEach(theme => {
        const divElement = document.createElement("div")
        divElement.classList.add('flex', 'items-center', 'hover:bg-base-100', 'py-2', 'px-3', 'cursor-pointer')

        const inputElement = document.createElement("input")
        inputElement.type = 'radio'
        inputElement.name = 'radio'
        inputElement.classList.add('radio', 'radio-primary')
        if (theme == selectedTheme)
            inputElement.checked = true

        const spanElement = document.createElement('span')
        spanElement.textContent = theme
        spanElement.classList.add('capitalize', 'font-bold')

        const previewElement = document.createElement('div')
        previewElement.dataset.theme = theme
        previewElement.classList.add('flex', 'justify-between', 'px-3', 'items-center', 'gap-5', 'bg-base-100', 'rounded-md', 'w-full', 'ms-5')
        previewElement.appendChild(spanElement)

        const elContainer = document.createElement('div')
        elContainer.classList.add('flex')

        previews.forEach(preview => {
            const el = document.createElement('span')
            el.classList.add('bg-' + preview, 'm-1', 'w-6', 'h-6')
            elContainer.appendChild(el)
        })

        previewElement.appendChild(elContainer)
        divElement.appendChild(inputElement)
        divElement.appendChild(previewElement)
        themeMenu.appendChild(divElement)

        divElement.addEventListener('click', () => {
            root.dataset.theme = theme
            localStorage.setItem('theme', theme)
            inputElement.checked = true
        })
    })
}

export function setItemManager(strItems: string) {
    const items: [] = JSON.parse(strItems)
    if(items.length > 0) {
        window.itemManager = new ItemManager(items)
        buildItemContainer()
    }
}

export function setPagination(strPagination: string) {
    window.pagination = JSON.parse(strPagination)
    if(window.pagination.lastPage > 0)
        buildPagination()

    if (window.pagination.lastSearch != null) {
        const search = document.getElementById('search') as HTMLInputElement
        search.value = window.pagination.lastSearch
    }
}

export function buildPagination() {
    const pagination = document.getElementById("pagination")
    const currentPage = window.pagination.currentPage
    const lastPage = window.pagination.lastPage
    let buttonsCreated = 0
    let buttonPage = 0
    let counter = 0
    let cmpLastPage = lastPage
    let arrowButton: HTMLButtonElement

    if (currentPage - 2 > 0) {
        buttonPage = currentPage - 2
        counter = 2
    }
    else if (currentPage - 1 > 0) {
        buttonPage = currentPage - 1
        counter = 1
    }
    else
        buttonPage = currentPage

    while (cmpLastPage - currentPage < 2 && buttonPage - 1 > 0) {
        buttonPage--
        cmpLastPage++
    }

    if (lastPage == 1)
        pagination.classList.add("hidden")
    else {
        arrowButton = createPaginationArrow('fa-angles-left', 1)
        pagination.appendChild(arrowButton)

        arrowButton = createPaginationArrow('fa-chevron-left', currentPage - 1)
        pagination.appendChild(arrowButton)

        while (buttonPage <= lastPage && buttonsCreated < 5) {
            const button = document.createElement('button')
            button.classList.add('join-item', 'btn')
            button.textContent = buttonPage.toString()
            if (buttonPage == currentPage) {
                button.setAttribute('disabled', '')
                button.style.border = '1px solid'
                button.style.zIndex = '10'
            }
            else {
                addPaginationButtonListener(button, button.textContent)
            }

            pagination.appendChild(button)
            buttonPage++
            buttonsCreated++
        }


        arrowButton = createPaginationArrow('fa-chevron-right', currentPage + 1)
        pagination.appendChild(arrowButton)

        arrowButton = createPaginationArrow('fa-angles-right', lastPage)
        pagination.appendChild(arrowButton)
    }
}

function createPaginationArrow(className: string, page: number) {
    const currentPage = window.pagination.currentPage
    const lastPage = window.pagination.lastPage

    const button = document.createElement('button')
    button.classList.add('join-item', 'btn')

    const icon = document.createElement('i')
    icon.classList.add('fa-solid', className)

    button.appendChild(icon)

    if (currentPage != page && page <= lastPage && page >= 1)
        addPaginationButtonListener(button, page.toString())
    else
        button.setAttribute('disabled', '')

    return button
}

function addPaginationButtonListener(element: HTMLButtonElement, page: string) {
    element.addEventListener('click', () => {
        const form = document.createElement('form')
        form.classList.add('hidden')
        form.method = 'get'

        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'page'
        input.value = page

        if (window.pagination.lastSearch != null) {
            const searchElement = document.createElement('input')
            searchElement.type = 'hidden'
            searchElement.name = 'search'
            searchElement.value = window.pagination.lastSearch
            form.appendChild(searchElement)
        }

        form.appendChild(input)
        document.body.appendChild(form)
        form.submit()
    })
}

export function getRandomItems() {
    const form = document.createElement('form')
    form.method = 'get'
    form.classList.add('hidden')

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'random'
    input.value = ''

    form.appendChild(input)
    document.body.appendChild(form)
    form.submit()
}

export function buildItemContainerCards() {
    const itemContainer = document.getElementById('itemContainer')
    itemContainer.textContent = ""
    itemContainer.className = ''
    itemContainer.classList.add('max-w-super', 'grid', 'grid-cols-12', '2xl:grid-cols-10', 'sm:gap-12')
    const items = window.itemManager.getItems();

    items.forEach(item => {
        const element = document.createElement('div')
        element.classList.add('col-span-12', 'sm:col-span-6', 'lg:col-span-4', 'xl:col-span-3', '2xl:col-span-2', 'transition-transform', 'duration-300', 'hover:scale-105', 'mb-10', 'sm:mb-0')

        const card = document.createElement('div')
        card.classList.add('card', 'w-full', 'glass', 'bg-accent', 'bg-opacity-5', 'shadow-md', 'shadow-base-300')

        const figure = document.createElement('figure')

        const image = document.createElement('img')
        image.src = 'images/' + item.src
        image.alt = item.name

        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')

        const cardTitle = document.createElement('h2')
        cardTitle.classList.add('card-title')
        cardTitle.textContent = item.name

        const date = document.createElement('p')
        date.textContent = item.date.toString()

        const actions = document.createElement('div')
        actions.classList.add('card-actions', 'justify-end')

        const signal = document.createElement('div')
        signal.classList.add('text-2xl')

        const wrong = document.createElement('i')
        wrong.classList.add('fa-solid', 'fa-wrong')

        const button = document.createElement('button')
        if (window.itemManager.isBlocked(item.id)) {
            button.classList.add('btn', 'btn-warning')
            button.textContent = 'Attendo conferma...'
        }
        else {
            signal.classList.add('hidden')
            button.classList.add('btn', 'btn-success')
            button.textContent = 'Blocca Immagine'
        }
        button.addEventListener('click', () => {
            window.itemManager.toggleBlockItem(item.id)
            signal.classList.toggle('hidden')
            checkBtnBlocker()
            button.textContent == 'Blocca Immagine' ? button.textContent = 'Attendo conferma...' : button.textContent = 'Blocca Immagine'
            button.classList.toggle('btn-success')
            button.classList.toggle('btn-warning')
        })

        signal.appendChild(wrong)

        actions.appendChild(signal)
        actions.appendChild(button)

        cardBody.appendChild(cardTitle)
        cardBody.appendChild(date)
        cardBody.appendChild(actions)

        figure.appendChild(image)

        card.appendChild(figure)
        card.appendChild(cardBody)

        element.appendChild(card)
        itemContainer.appendChild(element)
    })
}

export function blockItems() {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'block'
    form.classList.add('hidden')

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'idsToBlock'
    input.value = window.itemManager.getBlockedItemIdsStringified()

    form.appendChild(input)
    document.body.appendChild(form)

    form.submit()
}

function checkBtnBlocker() {
    const btnBlocker = document.getElementById('btnBlocker')
    window.itemManager.getBlockedItemIds().length > 0 ? btnBlocker.removeAttribute('disabled') : btnBlocker.setAttribute('disabled', '')
}

export function restoreItems() {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = 'restore'
    form.classList.add('hidden')

    document.body.appendChild(form)

    form.submit()
}

export function buildItemContainerTable() {
    const items = window.itemManager.getItems()
    const itemContainer = document.getElementById('itemContainer')

    itemContainer.textContent = ""
    itemContainer.className = ''
    itemContainer.classList.add('overflow-x-auto')

    const headers = ['Immagine', 'Nome', 'Data', 'Blocca']

    const table = document.createElement('table')
    table.classList.add('table')

    const thead = document.createElement('thead')
    thead.classList.add('text-xl')
    let tr = document.createElement('tr')
    tr.classList.add('text-center')

    headers.forEach(header => {
        const th = document.createElement('th')
        th.textContent = header

        tr.appendChild(th)
    })
    thead.appendChild(tr)

    const tbody = document.createElement('tbody')

    items.forEach(item => {
        tr = document.createElement('tr')
        tr.classList.add('text-center')
        let td = document.createElement('td')
        const img = document.createElement('img')
        img.src = "images/" + item.src
        img.alt = item.name
        img.width = 100
        img.classList.add('m-auto', 'rounded-full', 'shadow', 'shadow-md', 'shadow-base-300')
        td.appendChild(img)
        tr.appendChild(td)

        td = document.createElement('td')
        td.textContent = item.name
        tr.appendChild(td)

        td = document.createElement('td')
        td.textContent = item.date.toString()
        tr.appendChild(td)

        td = document.createElement('td')
        const input = document.createElement('input')
        input.type = 'checkbox'
        if(window.itemManager.isBlocked(item.id))
            input.checked = true
        input.classList.add('checkbox')
        input.addEventListener('click', () => {
            window.itemManager.toggleBlockItem(item.id)
            checkBtnBlocker()
        })
        td.appendChild(input)
        tr.appendChild(td)

        tbody.appendChild(tr)
    })

    table.appendChild(thead)
    table.appendChild(tbody)
    itemContainer.appendChild(table)
}

function buildItemContainer() {
    const visualization = localStorage.getItem('visualization')
    if (visualization == null || visualization == 'cards') {
        localStorage.setItem('visualization', 'cards')
        buildItemContainerCards()
    }
    else
        buildItemContainerTable()
}

export function changeVisualization() {
    const visualization = localStorage.getItem('visualization')
    if (visualization == 'cards') {
        localStorage.setItem('visualization', 'table')
        buildItemContainerTable()
    }
    else {
        localStorage.setItem('visualization', 'cards')
        buildItemContainerCards()
    }
}

export function sortByName(event: Event) {
    const icon = (event.currentTarget as HTMLElement).querySelector('svg')
    icon.classList.toggle('fa-arrow-down-a-z')
    icon.classList.toggle('fa-arrow-down-z-a')

    window.itemManager.sortByName()
    buildItemContainer()
}

export function sortByDate(event: Event) {
    const icon = (event.currentTarget as HTMLElement).querySelector('svg')
    icon.classList.toggle('fa-calendar-plus')
    icon.classList.toggle('fa-calendar-minus')

    window.itemManager.sortByDate()
    buildItemContainer()
}