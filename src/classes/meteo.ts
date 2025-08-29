import type { Coordinate } from "../interfaces/coordinate";
import type { Condizioni } from "../interfaces/condizioni";

export class Meteo {

    private apiKey: string = '5940ca718251d65d86e8c966f538e6f6';
    private geoCodeEndpoint: string = 'http://api.openweathermap.org/geo/1.0/direct';
    private weatherEndpoint: string = 'https://api.openweathermap.org/data/2.5/weather';
    private weatherIconUrl: string = 'https://openweathermap.org/img/wn/';
    private citta: string;

    constructor(citta: string) {
        this.citta = citta;
    }

    //Richiedo le coordinate
    async getCoordinates(limit: string = '5'): Promise<Coordinate[]> {
        try{
            const res = await fetch(`${this.geoCodeEndpoint}?q=${this.citta}&limit=${limit}&appid=${this.apiKey}`);
            const data: Coordinate[] = await res.json();
            return data;
        } catch (err) {
            let emptyCoordinate: Coordinate[] = [];

            return emptyCoordinate;
        }
    }

    async getCondizione(lat: string, lon: string): Promise<Condizioni> {
        try {
                const res = await fetch(`${this.weatherEndpoint}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=it`);
                const data: Condizioni = await res.json();
                return data;

        } catch(err) {
            let emptyCondizioni: Condizioni = {

            };

            return emptyCondizioni;
        }
    }
    
    getIconUrl(id: string): string {
        if(!id) {
            return '';
        }

        return `${this.weatherIconUrl}${id}@2x.png`;
    }

}