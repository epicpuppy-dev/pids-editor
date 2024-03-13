import { Arrival } from "../editor/Arrival";

export class ArrivalController {
    arrivals: Arrival[] = [];
    time: number = Date.now();
    NUM_TRAINS: number = 50

    constructor () {
        // generate trains
        for (let i = 0; i < this.NUM_TRAINS; i++) {
            this.generateTrain();
        }
    }

    public generateTrain () {
        let stops = [];
        this.time += Math.floor((Math.random() + 0.5) * 120 * 1000);
        let trainTime = this.time;
        for (let j = 0; j < Math.floor(Math.random() * 12) + 2; j++) {
            trainTime += Math.floor((Math.random() + 0.25) * 120 * 1000);
            stops.push({
                name: STATIONS[Math.floor(Math.random() * STATIONS.length)],
                time: trainTime
            });
        }
        this.arrivals.push(new Arrival (
            STATIONS[Math.floor(Math.random() * STATIONS.length)], // destination
            this.time, // arrival time
            (Math.floor(Math.random() * 15) + 1).toString(), // platform (1-16)
            0, // delay
            "test", // line name
            "#ffff00", // line color
            stops, // stops
            (Math.floor(Math.random() * 10) + 2).toString() // cars (2-12)
        ));
    }

    public update () {
        this.time = Date.now();
        this.arrivals = this.arrivals.filter(arrival => arrival.time > this.time);
        while (this.arrivals.length < this.NUM_TRAINS) {
            this.generateTrain();
        }
    }
}

const STATIONS = [
    "Desert Grand Central",
    "Reston Intermodal",
    "Northview Central",
    "Fairview Docks",
    "Fairview Junction",
    "Temple of Time",
    "Lake City",
    "Chong Shu Chau",
    "Spawn",
    "Cyan Heights",
    "Inage Kaigan",
    "Hobb's End",
    "Market Quarter",
    "New Victoria",
    "Rosewood",
    "Llanmara Saint Ann's",
    "Yunlong",
    "Sakuradori",
    "Bethel Road",
    "Minami Yunlong"
];