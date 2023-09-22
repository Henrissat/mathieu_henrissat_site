import { useState } from "react";
import { getRandomDiceRoll } from "../../utils/diceRoll6";

function score(dice : number[]) {
  //initialisé valeur à 0
  const counts = [0, 0, 0, 0, 0, 0];
  //score à 0
  let totalScore = 0;

  //parcourir le tableau et voir les valeurs
  for (const value of dice ) {
    counts[value - 1]++;
  }

  //Algorithm de calcul
  for (let i = 0; i < 6; i++) {
    if (counts[i] === 3) {
      if (i === 0) {
        totalScore += 1000;
      } else {
        totalScore += (i + 1) * 100;
      }
      counts[i] -= 3;
    }
    if (i === 0) {
      totalScore += counts[i] * 100;
    } else if (i === 4) {
      // Pour les 5, on a 50 points chacun
      totalScore += counts[i] * 50;
    }
    // Ajouter les conditions pour les cas où il y a 4 dés pareils
    if (counts[i] === 4) {
      if (i === 0) {
        totalScore += 2000;
      } else {
        totalScore += (i + 1) * 100 * 2; 
      }
      counts[i] -= 4;
    }
    // Ajouter les conditions pour les cas où il y a 5 dés pareils
    if (counts[i] === 5) {
      if (i === 0) {
        totalScore += 4000;
      } else {
        totalScore += (i + 1) * 100 * 2 * 2; 
      }
      counts[i] -= 5;
    }
    // Ajouter les conditions pour les cas où il y a 6 dés pareils
    if (counts[i] === 6) {
      if (i === 0) {
        totalScore += 8000;
      } else {
        totalScore += (i + 1) * 100 * 2 * 2 * 2; 
      }
      counts[i] -= 6;
    }
  }
  return totalScore;
}

function Greed() {
  const [dice, setDice] = useState<number[]>([])

  // Appeler la fonction score avec le tableau de dés
  const result = score(dice);

  // Gestionnaire de clic pour ajouter 6 lancers de dé au tableau
  const handleRollDice = () => {
    const newDice = [];
    for (let i = 0; i < 6; i++) {
      newDice.push(getRandomDiceRoll());
    }
    setDice(newDice);
  };


  return (
    <div>
      <button onClick={handleRollDice}>Lancer les dés</button>
      <div>Résultats des lancers de dé : {dice.join(', ')}</div>
      <div>Votre score est de : {result}</div>
      <div id="greedRules">
        <p>Aperçu des règles de cupidité :

La cupidité, également connue sous le nom de 10 000, est un jeu de dés dans lequel chaque joueur s'affronte pour être le premier à atteindre 10 000 points. Prenez des risques, repoussez les limites et soyez gourmand dans ce jeu conçu pour deux joueurs ou plus. Tout ce dont vous avez besoin, ce sont six dés et un bloc de scores pour jouer. Vous trouverez ci-dessous les règles complètes de la cupidité.


Démarrage du jeu :

Pour démarrer la partie, vous avez besoin de deux joueurs (minimum) et de six dés à six faces. Demandez à tous les joueurs de lancer un dé pour déterminer qui commence. Le jet élevé commence le jeu et le jeu se poursuit dans le sens des aiguilles d'une montre.

Le jeu commence lorsque le premier joueur lance les six dés et tente d’obtenir un score de 500 ou plus lors de son lancer initial pour « entrer » dans la partie. Si un score de 500 ou plus n’est pas atteint pendant le tour du joueur, il ne marque aucun point pour ce tour. Une fois qu'un joueur a marqué son « entrée » initiale de 500 points, il ajoute tous les points accumulés lors des tours suivants à son score, même s'il marque moins de 500 points dans un tour.

Si un joueur ne obtient pas de combinaison de points à son tour, son tour est terminé et le jeu continue dans le sens des aiguilles d'une montre. Si un joueur obtient une combinaison de points, il peut choisir de prendre ce score et de l'ajouter à son total cumulé, ou il peut devenir gourmand et relancer pour tenter d'obtenir un score plus élevé.

    Les joueurs peuvent choisir de relancer les six dés, perdant ainsi leur score initial dans l’espoir d’en marquer un plus élevé.
    Les joueurs peuvent choisir de conserver certains dés déjà en position de score pour tenter d'obtenir un score plus élevé avec les dés restants. Cependant, si un score plus élevé n’est pas obtenu avec la relance, le joueur marque 0 pour le tour.

Règles de notation de la cupidité :

    1=100 points
    5=50 points
    Brelan = 100 x le nombre sur le dé (100 points pour trois 1, 500 points pour trois 5, etc.)
    4 exemplaires = 1000 points
    trois paires (ne peuvent être obtenues que sur un seul lancer) = 1500 points.
    Une suite avec les six dés (ne peut être obtenue que sur un seul lancer) = 2000 points.
    5 exemplaires = 2000 points.
    6 exemplaires = 3000 points.

Règles gagnantes pour la cupidité :

Le jeu se termine lorsque le premier joueur atteint 10 000 points ou plus. Alternativement, vous pouvez accorder à tous les autres joueurs un tour supplémentaire une fois que 10 000 points ont été atteints pour tenter de battre le score.</p>
    </div>
    </div>
  );
}

export default Greed;


// Greed is a dice game played with five six-sided dice. Your mission, should you choose to accept it, is to score a throw according to these rules. You will always be given an array with five six-sided dice values.

//  Three 1's => 1000 points
//  Three 6's =>  600 points
//  Three 5's =>  500 points
//  Three 4's =>  400 points
//  Three 3's =>  300 points
//  Three 2's =>  200 points
//  One   1   =>  100 points
//  One   5   =>   50 point
// A single die can only be counted once in each roll. For example, a given "5" can only count as part of a triplet (contributing to the 500 points) or as a single 50 points, but not both in the same roll.

// Example scoring

//  Throw       Score
//  ---------   ------------------
//  5 1 3 4 1   250:  50 (for the 5) + 2 * 100 (for the 1s)
//  1 1 1 3 1   1100: 1000 (for three 1s) + 100 (for the other 1)
//  2 4 4 5 4   450:  400 (for three 4s) + 50 (for the 5)
// In some languages, it is possible to mutate the input to the function. This is something that you should never do. If you mutate the input, you will not be able to pass all the tests.
