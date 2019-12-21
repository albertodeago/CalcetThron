'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('allgames.json');
let allGames = JSON.parse(rawdata);

const numberOfGames = allGames.length;
console.log(numberOfGames); // 984

const totalGoals = allGames.reduce((prev, game) => prev + game.result.blue + game.result.red, 0);
console.log(totalGoals); // 10632

const averageGoalsPerGame = (totalGoals / numberOfGames).toFixed(2)
console.log(averageGoalsPerGame) // 10.80 per partita

const isSeiASei = (game) => ((game.result.blue === 7 && game.result.red === 6) || (game.result.blue === 6 && game.result.red === 7))
const numberOfSeiASeiAnnunciato = allGames.reduce((prev, game) => isSeiASei(game) ? prev + 1 : prev, 0)
console.log(numberOfSeiASeiAnnunciato); // 210

const precentageOfSeiASeiAnnunciato = (numberOfSeiASeiAnnunciato / numberOfGames * 100).toFixed(2) + "%"
console.log(precentageOfSeiASeiAnnunciato) // 21.34%

const getAutogoals = game => (game.blueStrikerAutogoals + game.blueKeeperAutogoals + game.redKeeperAutogoals + game.redStrikerAutogoals)
const numberOfAutogoals = allGames.reduce((prev, game) => prev + getAutogoals(game), 0);
console.log(numberOfAutogoals); // 597

const autogoalsPerGame = (numberOfAutogoals / numberOfGames).toFixed(2);
console.log(autogoalsPerGame); //  0.61 per partita

const vittorieBlu = allGames.reduce((prev, game) => game.result.blue === 7 ? prev + 1 : prev, 0);
console.log(vittorieBlu); // 472

const vittorieRosse = allGames.reduce((prev, game) => game.result.red === 7 ? prev + 1 : prev, 0);
console.log(vittorieRosse); // 512

const vittorieRossePercentuale = (vittorieRosse / numberOfGames * 100).toFixed(2) + "%";
console.log(vittorieRossePercentuale); // 52%


// CalcetThron in numberi:
// qua le robe scritte sopra (mostrare lo snippet per tirare fuori i 6-6 annunciato)
// Partite giocate: 984
// Goal totali: 10632
// Goal per partita: ~11
// Numero di autogola: 597
// per una media di ~0.6 a partita
// Vittorie della squadra blu: 472
// Vittorie della squadra rossa: 512 (~52% vittorie)
// ***E per finire la statistica più attesa:***
// Numero di 6 a 6 annunciato: 210
// Quindi una percentuale del ~21.34%
// per chi volesse vedere la splendida formula per tirare fuori il dato:
//   const isSeiASei = game => ((game.result.blue === 7 && game.result.red === 6) || (game.result.blue === 6 && game.result.red === 7))
//   const numberOfSeiASeiAnnunciato = allGames.reduce((prev, game) => isSeiASei(game) ? prev + 1 : prev, 0)
//
// Qualche premio e menzioni speciali date finora:
// Giocatore più vincente: Luca Tiozzo... però vabbe con 2 an(n seconda n strikethrough) i sarebbe capace chiunque
// Giocatore più spietato: Paolo Marchezzolo detto il "terminator"
// Nobel per il calcetto: Simone Carriero, premiato per la sua tecnica quantistica
// Arbitro ufficiale: Domenico Stragliotto
// Premio fair play: Flavio Alberti
// Giocatore più memeizzato: Simone (link o img meme)
// Tiro più forte fatto: non esiste ancora hardware che resiste alle partite fatte.
//
// Questi dati sono messi a disposizione gratuitamente dal CEO di CalcetThron.
// Ringraziamo il team di sviluppo CalcetThron, il team di support, il CEO il CTO e il CFO di 
// questa azienda che vi permette di usufruire gratuitamente dei loro servizi/app


/*
{
    "blueKeeperAutogoals":0,
    "blueKeeperGoals":0,
    "blueStrikerAutogoals":0,
    "blueStrikerGoals":6,
    "blueTeam":{
        "keeper":"itcJlXrODRdqv1UEXbFZHVTNrON2",
        "striker":"xlviGkyEnjRBu0YPiYYXoQQwq242"
    },
    "creationDate":1559225370268,
    "redKeeperAutogoals":0,
    "redKeeperGoals":2,
    "redStrikerAutogoals":1,
    "redStrikerGoals":2,
    "redTeam":{
        "keeper":"YNuC8d8XuEcvTl2BB79CW34PAX43",
        "striker":"UPbeSeRXi4PgDPaxR5a0UwJ7ecD2"
    },
    "result":{
        "blue":7,
        "red":4
    }
}
*/