import { useState } from "react";
import { getRandomDiceRoll } from "../../utils/diceRoll6";

function Greed() {
  const [dice, setDice] = useState<number[]>([]);
  const [savedDice, setSavedDice] = useState<number[]>([]);
  const [accumulatedScore, setAccumulatedScore] = useState<number>(0);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  // const [gameStarted, setGameStarted] = useState<boolean>(false);
  // console.log('gameStarted', gameStarted)


  // Gestionnaire de clic pour sauvegarder un chiffre
  const handleSaveDice = (number: number) => {
    setSavedDice([...savedDice, number]);
    // Trouver et retirer la première occurrence du chiffre de dice
    const index = dice.indexOf(number);
    if (index !== -1) {
      const newDice = [...dice];
      newDice.splice(index, 1);
      setDice(newDice);
    }
  };

  // Gestionnaire de clic pour faire revenir un chiffre dans dice
  const handleReturnToDice = (number: number) => {
    setDice([...dice, number]);
    // Trouver et retirer le chiffre de savedNumbers
    const index = savedDice.indexOf(number);
    if (index !== -1) {
      const newSaveDice = [...savedDice];
      newSaveDice.splice(index, 1);
      setSavedDice(newSaveDice);
    }
  };

  
  // Gestionnaire de clic pour ajouter 6 lancers de dé au tableau
  const handleRollDice = async() => {
      if(dice.length === 0) {
        const newDice = [];
        for (let i = 0; i < 6; i++) {
          newDice.push(getRandomDiceRoll());
        }
        // Attendre un court instant pour que le rendu se mette à jour
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Vérifier si c'est un Game Over
        const result = calculateFinalScore(newDice);
        // Game Over
        if (result === 0) {
          alert("Game Over! You didn't score any points.");
          setShowSaveButton(false); 
          setDice([])
          setSavedDice([])
        } 
        setDice(newDice);
        setShowSaveButton(true);
      }else {
        const newDice = [...dice];
        for (let i = 0; i < newDice.length ; i++) {
          newDice[i] = getRandomDiceRoll();
        }
        // Attendre un court instant pour que le rendu se mette à jour
        await new Promise((resolve) => setTimeout(resolve, 0));

        // Vérifier si c'est un Game Over
        const result = calculateFinalScore(newDice);
        console.log('result', result)
        if (result === 0) {
          // Game Over
          alert("Game Over! You didn't score any points.");
          setShowSaveButton(false); // Masquer le bouton de sauvegarde
          setDice([])
          setSavedDice([])
        } 
        setDice(newDice);
      }

  };

  // Fonction pour calculer le score en utilisant les chiffres sauvegardés
  const calculateFinalScore = (dice: number[]) => {
    //initialiser un tableau pour compter les occurrences de chaque valeur de dé (1 à 6)
    const counts = [0, 0, 0, 0, 0, 0];
    //score de base
    let totalScore = 0;
    //parcourir le tableau et voir les valeurs
    for (const value of dice) {
      counts[value - 1]++;
  }

  //Faire l'algorithme de calcul
  for (let i = 0; i < 6; i++) {
    if (counts[i] >= 3) {
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
      totalScore += counts[i] * 50;
    }
    if (counts[i] === 4) {
      if (i === 0) {
        totalScore += 2000; 
      } else {
        totalScore += (i + 1) * 200; 
      }
      counts[i] -= 4;
      }
    }
    return totalScore;
  };

  // Calculer le score du lancer de dés
  const result = calculateFinalScore(dice);

  // Calculer le Score final en utilisant les chiffres sauvegardés
  const handleSaveScore = () => {
    const calculatedFinalScore = calculateFinalScore(savedDice);
    setAccumulatedScore((prevAccumulatedScore) => prevAccumulatedScore + calculatedFinalScore);
    setFinalScore((prevFinalScore) => prevFinalScore + calculatedFinalScore);
    setSavedDice([]);
  };

  return (
    <div>
      <button onClick={handleRollDice}>Lancer les dés</button>
      <div>Résultats des lancers de dé :  {dice.map((number, index) => (
          <button key={index} onClick={() => handleSaveDice(number)}>
            {number}
          </button>
        ))}</div>
      <div>Votre score est de : {result}</div>
      <div>Mes dés sauvegardés : {savedDice.map((number, index) => (
          <button key={index} onClick={() => handleReturnToDice(number)}>
            {number}
          </button>
        ))}
        {showSaveButton && (
        <button onClick={handleSaveScore}>Sauvegarder mon score</button>
        )}
      </div>
      <button>Suivant</button>
      <br/>
      <div>
        Final Score : {finalScore}
      </div>
      <div id="greedRules">
        <p>
            But du jeu :
            Atteindre un score de 10 000 points.
            Déroulement du jeu :
            Les joueurs jouent les un après les autres.
            Description d'un tour de jeu :
            Jeter les 5 dés.
            Mettre de côté le ou les dés permettant de gagner des points.
            Si on le souhaite arrêter, laisser la main au joueur suivant et additionner le score obtenu lors du tour aux points déjà acquis lors des autres tours.
            Ou si on préfère lancer les dés non utilisés dans l'espoir de faire grimper le score obtenu lors du tour.
            Si un des jets de dés ne rapporte rien, le score du tour du jeu est nul, et c'est au joueur suivant de lancer les 5 dés.
            Comptage des points :
            Un As : 100 pts
            Un 5 : 50 pts
            Brelan d'As : 1000 pts
            Brelan de 5 : 500 pts
            Brelan de 2,3,4,6 : 200, 300, 400,600 pts
            Suite : 1,2,3,4,5 ou 2,3,4,5,6 : 1500 pts
            Remarque 1 : Pour être valides, les brelans ou suites doivent être produits sur un seul jeté de dé.
            Ex :
            on obtient 1, 3, 4, 4, 6 au premier lancé
            seul le 1 permet d'augmenter le score du tour (+100 pts). On le garde et on relance les autres dés.
            On obtient 5, 3, 3, 4
            seul le 5 permet d'augmenter le score du tour (+50 pts, soit 150 en tout). On le garde et on relance les autres dés.
            On obtient 2, 3, 4 : rien ne permet de marquer avec ces 3 dés (même si les 5 dés constituent une suite), les 150 points sont perdus.
            Remarque 2 : Lorsque les 5 dés ont permis de marquer, ils peuvent être tous relancés en vue d'améliorer le score du tour (au risque de le perdre entièrement).
            Remarque 3 : Il faut totaliser 1000 points avant de pouvoir commencer à comptabiliser ses points
      </p>
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
