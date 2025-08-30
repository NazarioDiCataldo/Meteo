//import './style.css';
import { Meteo } from "./classes/meteo";

const città: [string, string, string] = ['Milano', 'Roma', 'Napoli'];

//Azioni che si svolgono al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {

  //Mi prendo il wrapper delle card
  const cardWrapper: HTMLDivElement | null = document.querySelector('#card-wrapper');

  //Mi prendo i vari input
  const citySearch: NodeList = document.querySelectorAll('input[name="city"]')!;

  //Mi prendo il dropdown, collegato all'input
  const dropdownSearch: NodeList = document.querySelectorAll('.dropdown')!;
  


  //Aggiungo tutti gli input al listener
  citySearch.forEach((e, pos) => {
    e.addEventListener('input', () => {
    //Dropdown che scompare o compare in base a quello che scrive l'utente
      if(e.value.length === 0) {
        dropdownSearch[pos].classList.add('hidden');
        dropdownSearch[pos].classList.remove('block');
      } else {
        dropdownSearch[pos].classList.remove('hidden');
        dropdownSearch[pos].classList.add('block');
      }

      //Mi creo un classe meteo con quello che l'utente scrive
      const meteo: Meteo = new Meteo(e.value);
      meteo.generateList(dropdownSearch[pos]);
    });
  })
  //Richiedo il meteo delle 3 città
  if(cardWrapper) {
    città.forEach(async (e: string) => {
      const meteo = new Meteo(e);
      await meteo.generateCard(cardWrapper);
    });
  }

})