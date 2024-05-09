export class MinimizableDropdown {
    public id: string;
    public extended: boolean = true;
    private display: HTMLSpanElement;
    private header: HTMLDivElement;
    private identifiers: HTMLTableRowElement[];

    constructor (id: string) {
        this.id = id;
        this.display = document.getElementById(id + "Dropdown")! as HTMLSpanElement;
        this.header = document.getElementById(id + "DropdownHeader")! as HTMLDivElement;
        let elements = document.getElementsByClassName(id + "DropdownElement");
        this.identifiers = [];
        for (let i = 0; i < elements.length; i++) {
            this.identifiers.push(elements[i] as HTMLTableRowElement);
        }
        this.header.onclick = () => this.toggle();
    }

    public toggle () {
        this.display.innerHTML = this.display.innerHTML == "[+]" ? "[-]" : "[+]";
        this.extended = !this.extended;
        for (let i = 0; i < this.identifiers.length; i++) {
            this.identifiers[i].style.display = this.extended ? "table-row" : "none";
        }
    }
}