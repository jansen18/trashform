export class History{
    constructor(
        public trashType: string,
        public price: number,
        public weight: number,
        public dateTraded: string,
        public seller: string,
        public boughtBy: string
    ){}
}