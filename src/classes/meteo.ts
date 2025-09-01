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
    async getCoordinates(limit: number): Promise<Coordinate[]> {
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
    
    async getPrevisioni(lat: string, lon: string) {

    }

    getIconUrl(id: string): string {
        if(!id) {
            return '';
        }

        return `${this.weatherIconUrl}${id}@2x.png`;
    }

    getLocaleDateTime(timezone: number): Date {

        const localTime = new Date().getTime() //Ottengo l'ora locale corrente (in Italia in questo caso)
        const localOffset = new Date().getTimezoneOffset() * 60000 //Mi ricavo l'offset locale
        const currentUtcTime = localOffset + localTime //Tramite l'offset locale ricavato, mi ricavo l'UCT locale (UTC +1), sommandolo all'ora corrente 
        const cityOffset = currentUtcTime + 1000 * timezone //Mi ricavo l'offsett della città in questione, tramite l'UTC, convertito da millisecondi, per la timezone
        const cityTime = new Date(cityOffset); //Ora che so l'offset riesco a ricavarmi l'oggetto Date corretto di una specifica città
        return cityTime;
    }

    async generateList(wrapper: HTMLUListElement): Promise<void> {
        //Prima svuoto il wrapper
        wrapper.innerHTML = '';

        //Mi prendo le località in base alla ricerca dell'utente
        let localita: Coordinate[] = await this.getCoordinates(3);

        //Se località è vuoto, e quindi non ci sono città da vedere, viene mostrato un messaggio di fallback
            if(localita.length === 0) {
                //Mi creo il tag li
                let liTag = document.createElement('li');

                //Aggiungo il li tag al wrapper
                wrapper.append(liTag);

                liTag.textContent = "Nessun risultato disponibile. Prova con un'altra ricerca";

                liTag.classList = 'w-full p-4 text-center';

                //Esco dalla funzione
                return;
            }


        //Per ogni località mi prendo le condizioni e le metto nell'array
        localita.forEach(async (e,pos) => {
            //Per ogni elemento, mi creo il tag li e mi creo il layout
            //Mi creo il tag li
            let liTag = document.createElement('li');

            //Aggiungo il li tag al wrapper
            wrapper.append(liTag);

           //Mi creo la singola condizione
            let condizione: Condizioni = await this.getCondizione(e.lat, e.lon); 

            //Mi creo l'oggetto date per la data
            const dateToday: Date = this.getLocaleDateTime(condizione.timezone!)

            //Mi creo anche il tag a per il link alla pagina specifica
            let aTag = document.createElement('a');
            //Imposto il link dinamicamente
            aTag.href = `meteo.html?lat=${localita[pos].lat}&lon=${localita[pos].lat}`;
            //Inserisco il tag a dentro il tag li
            liTag.append(aTag);
            //Metto lo stile giusto per il tag a
            aTag.classList = 'block w-full p-3 flex justify-between items-center gap-3';

            
            //nome localita
            let nomeLocalita: string;
            if(localita[pos].local_names?.it) {
                nomeLocalita = localita[pos].local_names.it
            } else {
                nomeLocalita = localita[pos].name;
            }

            //Imposto il layout per ogni a
            aTag.innerHTML = `
                <figure class='flex flex-col items-center'>
                    <img src=${this.getIconUrl(condizione.weather[0]?.icon)} alt="" class="w-[48px] h-auto">
                    <figcaption class="text-center capitalize text-sm">${condizione.weather[0]?.description }</figcaption>
                </figure>
                <div class='localita flex flex-col text-primary items-start gap-1 grow'>
                    <div class='flex gap-1 items-baseline'>
                        <strong class="text-xl text-medium city-name">${nomeLocalita}</strong>,
                        <p class="country-name">${localita[pos].country}</p>
                    </div>
                    <div class='flex gap-3 items-baseline'>
                        <p class="time-zone text-md">${dateToday.getHours()} : ${dateToday.getMinutes()}</p>
                        <p class="time-zone text-xs">${dateToday.getDate()} / ${dateToday.getMonth()} / ${dateToday.getFullYear()}</p>
                    </div>
                </div>
                <div class="flex justify-end meteo">
                    <span class="degree text-2xl text-medium">${condizione.main?.temp} °</span>
                </div>
            `;
        });
    }

    async generateCard(wrapper: HTMLDivElement, limit: number): Promise<void> {
        //Mi prendo le coordinate delle città
        let localita: Coordinate[] = await this.getCoordinates(limit);
        
        for(let i = 0; i < localita.length; i++) {
            //In base alle coordinate mi ricavo le informazioni sul meteo
        let condizioni: Condizioni = await this.getCondizione( localita[i].lat, localita[i].lon);
        //Mi creo l'oggetto date per la data
        const dateToday: Date = this.getLocaleDateTime(condizioni.timezone!)

        //Mi creo il tag a con il link dinamico
        const aTag: HTMLAnchorElement = document.createElement('a');
        //metto le classi ad a
        aTag.classList = 'block w-full';
        //Assegno il link dinamico alle card
        aTag.href = `meteo.html?lat=${localita[i].lat}&lon=${localita[i].lat}`;

        //Aggiungo il tag a al wrapper di card
        wrapper.append(aTag);

        console.log(localita[i])
        //nome localita
        let nomeLocalita: string;
        if(localita[i].local_names?.it) {
            nomeLocalita = localita[i].local_names.it
        } else {
            nomeLocalita = localita[i].name;
        }

        //Mi creo dinamicamente la card
        aTag.innerHTML = `
            <!-- Card -->
             <div class="w-full border-[1px] border-sky-500 p-5 rounded-lg bg-sky-500 hover:bg-sky-300 flex flex-col items-center gap-4 cursor-pointer shadow-lg transition-all duration-300">
              <figure class="weather-icon ">
                <img src=${this.getIconUrl(condizioni?.weather[0]?.icon)} alt="" class="w-[96px] h-auto">
                <figcaption class="text-center capitalize">${condizioni?.weather[0]?.description }</figcaption>
              </figure>
              <div class="localita flex text-primary items-end gap-1">
                <h4 class="text-xl text-medium city-name">${nomeLocalita}</h4>,
                
                <p class="country-name">${localita[i].country}</p>
                <div class='flex gap-3 items-baseline'>
                    <p class="time-zone text-md">${dateToday.getHours()} : ${dateToday.getMinutes()}</p>
                    <p class="time-zone text-xs">${dateToday.getDate()} / ${dateToday.getMonth()} / ${dateToday.getFullYear()}</p>
                </div>
              </div>
              <div class="flex flex-col meteo">
                <span class="degree text-2xl text-medium">${condizioni.main?.temp} °</span>
              </div>
              <div class="other w-full border-primary">
                <ul class="list-conditions w-full flex flex-col items-center">
                  <li class="wind">Vento: ${condizioni.wind?.speed} m/s</li>
                  <li class="humidity">Umidità: ${condizioni.main?.humidity} %</li>
                  <li class="pressure">Pressione atmosferica: ${condizioni.main?.pressure} h/Pa</li>
                </ul>
              </div>
             </div>
        `;
        }
    }
}