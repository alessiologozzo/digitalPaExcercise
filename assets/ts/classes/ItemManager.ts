import { Item } from "../interfaces/Item";

export class ItemManager {
    private orderedByNameAsc = false
    private orderedByDateAsc = false
    private blockedItemIds: number[] = []

    public constructor(private items: Item[]) {
        this.items.map(item => {
            item.date = new Date(item.date)
            return item
        })
    }

    public getItems() {
        //restituisco una stringa invce che un Date nel campo date degli elementi
        return (this.items.map(item => ({...item}))).map(item => {
            item.date = (item.date as Date).toLocaleDateString()
            return item
        })
    }

    public sortByName() {
        this.orderedByNameAsc ? this.items.sort((a, b) => b.name.localeCompare(a.name)) : this.items.sort((a, b) => a.name.localeCompare(b.name))
        this.orderedByNameAsc = !this.orderedByNameAsc
    }

    public sortByDate() {
        this.orderedByDateAsc ? this.items.sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime()) : this.items.sort((a, b) => (a.date as Date).getTime() - (b.date as Date).getTime())
        this.orderedByDateAsc = !this.orderedByDateAsc
    }

    public toggleBlockItem(id: number) {
        if(this.blockedItemIds.includes(id))
            this.blockedItemIds = this.blockedItemIds.filter(itemId => itemId != id)
        else
            this.blockedItemIds.push(id)

        console.log(this.blockedItemIds)
    }

    public getBlockedItemIdsStringified() {
        return JSON.stringify(this.blockedItemIds)
    }

    public getBlockedItemIds() {
        return this.blockedItemIds
    }

    public isBlocked(id: number) {
        return this.blockedItemIds.includes(id)
    }
}