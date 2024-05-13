import { PIDSEditor } from "../PIDSEditor";
import { Arrival } from "../util/Arrival";

export class ArrivalController {
    arrivals: Arrival[] = [];
    time: number = Date.now();
    NUM_TRAINS: number = 50

    constructor (editor: PIDSEditor) {
        // generate trains
        for (let i = 0; i < this.NUM_TRAINS; i++) {
            this.generateTrain(editor);
        }
    }

    public generateTrain (editor: PIDSEditor) {
        let stops = [];
        this.time += Math.floor((Math.random() + 0.5) * 120 * 1000);
        let trainTime = this.time;
        for (let j = 0; j < Math.floor(Math.random() * 24) + 4; j++) {
            trainTime += Math.floor((Math.random() + 0.25) * 120 * 1000);
            stops.push({
                name: STATIONS[Math.floor(Math.random() * STATIONS.length)],
                time: trainTime
            });
        }
        let destination = STATIONS[Math.floor(Math.random() * STATIONS.length)];
        stops.push({
            name: destination,
            time: trainTime + Math.floor((Math.random() + 0.25) * 120 * 1000)
        })
        this.arrivals.push(new Arrival (
            destination, // destination
            this.time, // arrival time
            (Math.floor(Math.random() * 15) + 1).toString(), // platform (1-16)
            0, // delay
            editor.edit.lineName, // line name
            "#" + Math.floor(Math.random() * 16777216).toString(16).padStart(6, "0"), // line color
            (Math.floor(Math.random() * 900) + 100).toString(), // line number
            stops, // stops
            (Math.floor(Math.random() * 14) + 2).toString(), // cars (2-16)
            editor.edit.station // station
        ));
    }

    public update (editor: PIDSEditor) {
        this.time = Date.now();
        this.arrivals = this.arrivals.filter(arrival => arrival.time > this.time);
        while (this.arrivals.length < this.NUM_TRAINS) {
            this.generateTrain(editor);
        }
    }

    public regenerate (editor: PIDSEditor) {
        this.time = Date.now();
        this.arrivals = [];
        for (let i = 0; i < this.NUM_TRAINS; i++) {
            this.generateTrain(editor);
        }
    }
}

const STATIONS = [
    // EpicPuppy613
    "Desert Grand Central",
    "Reston Intermodal",
    "Northview Central",
    "Fairview Docks",
    "Fairview Junction",
    "Geneva Junction",
    "Northview Docks",
    "Northview Island South",
    "Oasis North",
    "Desert Northeast Hills",
    // Navi
    "Temple of Time",
    "Lake City",
    "Chong Shu Chau",
    "Spawn",
    "Cyan Heights",
    "Aldgate",
    "Misashima",
    "Hamura",
    "Mita-Shiro",
    "Llanfairpwll",
    // Forest
    "Inage Kaigan",
    "Hana-Koshi Beach",
    // Lily
    "Hobb's End",
    "Market Quarter",
    "New Victoria",
    "Rosewood",
    "Llanmara Saint Ann's",
    "Loyalty Hills",
    "Diamond Creek",
    "Arbour",
    "Kowloon",
    "Exchange Place",
    // Yunlong
    "Yunlong",
    "Sakuradori",
    "Bethel Road",
    "Minami Yunlong",
    // szandor
    "Hylkemare Wieringawijk"
];