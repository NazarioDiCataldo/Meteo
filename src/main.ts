//import './style.css';
import { Meteo } from "./classes/meteo";
import type { Condizioni } from "./interfaces/condizioni";
import type { Coordinate } from "./interfaces/coordinate";


const città: [string, string, string] = ['Milano', 'Roma', 'Napoli'];

//Azioni che si svolgono al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {

  const cityTitles = document.querySelectorAll('.city-name');
  const cityCountry = document.querySelectorAll('.country-name');
  const cityDegree = document.querySelectorAll('.degree');
  const cityIcons = document.querySelectorAll('.weather-icon > img');
  const cityIconsDescription = document.querySelectorAll('.weather-icon > figcaption');
  
  //Richiedo il meteo delle 3 città
  città.forEach(async (e: string, pos: number) => {
    const meteo = new Meteo(e);
    //Mi prendo le coordinate delle città
    let localita: Coordinate[] = await meteo.getCoordinates('1');
    //In base alle coordinate mi ricavo le informazioni sul meteo
    let condizioni: Condizioni = await meteo.getCondizione( localita[0].lat, localita[0].lon)
    //Caso in cui le città non venissero trovate
    if(localita.length === 0) {
      //Fallback
      cityTitles[pos].textContent = e;
    }

    //Mi configuro i nomi delle località
    localita.forEach(e => {
      cityTitles[pos].textContent = e.local_names.it;
      cityCountry[pos].textContent = e.country;
    })

    //Configurazione delle condizioni
    cityDegree[pos].textContent = `${condizioni.main?.temp} °`;

    //Configurazione dell'icona
    cityIcons[pos].src = meteo.getIconUrl(condizioni.weather[0].icon);
    cityIconsDescription[pos].textContent = condizioni.weather[0].description;

  })
})