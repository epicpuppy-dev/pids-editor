export class Arrival {
    destination: string
    time: number
    platform: string
    delay: number
    lineColor: string
    lineName: string
    stops: {name: string, time: number}[]
    cars: string
    station: string

    constructor (
        destination: string, 
        time: number, 
        platform: string, 
        delay: number, 
        lineName: string, 
        lineColor: string, 
        stops: {name: string, time: number}[], 
        cars: string,
        station: string
    ) {
        this.destination = destination;
        this.time = time;
        this.platform = platform;
        this.delay = delay;
        this.lineName = lineName;
        this.lineColor = lineColor;
        this.stops = stops;
        this.cars = cars;
        this.station = station;
    }
}