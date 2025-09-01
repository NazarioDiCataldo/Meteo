//import './style.css';
import { debounce } from "lodash";
import { Meteo } from "./classes/meteo";

const città: [string, string, string] = ['Milano', 'Roma', 'Napoli'];

//Mi prendo il title tag
const titleTag = document.querySelector('head title')!;

async function getSearchResults(cityURL: string, cardWrapper: HTMLDivElement) {
  //Formatto cityURL
  cityURL = cityURL.split('%20').join(' ');
  //Mi creo la classe meteo
      const meteo = new Meteo(cityURL);
      //Mi prendo l'h1 della pagina
      const titleSearch = document.querySelector('h1')!;
      //Mi prendo il numero di città trovate
      const cities = await meteo.getCoordinates(12);
      //Conto quanti elementi ci sono
      let contatore: number = cities.length;
      titleSearch.textContent = `${contatore} risultati trovati per "${cityURL}"`;
      //Imposto il title tag con il nome della ricerca
      titleTag.textContent = `Ricerca per ${cityURL}`;
      //Genero le card
      await meteo.generateCard(cardWrapper, 12);
}

//Azioni che si svolgono al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {

  //Mi prendo tutti i form
  const formList: NodeList = document.querySelectorAll('form')!;

  //Mi prendo il wrapper delle card
  const cardWrapper: HTMLDivElement = document.querySelector('#card-wrapper')!;

  //Mi prendo i vari input
  const citySearch: NodeList = document.querySelectorAll('input[name="city"]')!;

  //Mi prendo il dropdown, collegato all'input
  const dropdownSearch: NodeList = document.querySelectorAll('.dropdown')!;

  //Mi creo la funzione di richiesta dei dati, ogni volta che l'utente scrive la searchbar

  const richiestaDati = (e: Node, pos: number) => {
      //Mi creo un classe meteo con quello che l'utente scrive
      const meteo: Meteo = new Meteo(e.value);
      //richiedo la lista
      meteo.generateList(dropdownSearch[pos]);
    };

  // Mi creo la variabile che contiene il metodo debounce, che ritarda l'invocazione della funzione
  let debounceRichiestaDati = debounce(richiestaDati, 1000);

  //Aggiungo tutti gli input al listener
  citySearch.forEach((e: Node, pos: number) => {

    e.addEventListener('input', () => {
      //Dropdown che scompare o compare in base a quello che scrive l'utente
      if(e.value.length === 0) {
        dropdownSearch[pos].classList.add('hidden');
        dropdownSearch[pos].classList.remove('block');
      } else {
        dropdownSearch[pos].classList.remove('hidden');
        dropdownSearch[pos].classList.add('block');
      }
      debounceRichiestaDati(e, pos)
    })
  })

  //Evento sul form
  formList.forEach((e: Node, pos: number) => {
    //URL della pagina search
    const searchUrl: string = './search.html';

    e.addEventListener('submit', async (e: Event) => {
      //Annullo l'azione del form
      e.preventDefault();
      const risultatoRicerca: string = citySearch[pos].value; 
      window.location.href = `${searchUrl}?city=${risultatoRicerca}`;
    })
  });

  //Wrapper che contiene le card
  if(cardWrapper) {
    //Controllo se sono nella home
    //solo nella home voglio vedere il meteo delle 3 città
    if(document.body.id === 'home') 
      //Richiedo il meteo delle 3 città
      città.forEach(async (e: string) => {
        const meteo = new Meteo(e);
        await meteo.generateCard(cardWrapper, 1);
    });

    //Controllo se sono nella pagina search
    if(document.body.id === 'search') {
      //mi prendo la città dall'url
      let cityURL = window.location.href.split('=').pop();
      if(cityURL) {
        getSearchResults(cityURL, cardWrapper);
      }
    }
  }
});