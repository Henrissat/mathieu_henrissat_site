import { useState } from "react";
import { getRandomDiceRoll } from "../../utils/diceRoll6";

function Greed() {
  const [dice, setDice] = useState<number[]>([]);
  const [savedDice, setSavedDice] = useState<number[]>([]);
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  const [numPlayers, setNumPlayers] = useState<number>(2); 
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  console.log('gameStarted', gameStarted)


  const playerNames = ["Joueur 1", "Joueur 2", "Joueur 3", "Joueur 4"];

  const initialPlayerScores = Array(numPlayers).fill(0);
  const [playerScores, setPlayerScores] = useState<number[]>(initialPlayerScores);
  const [activePlayerScore, setActivePlayerScore] = useState<number>(0);

  const checkWin = () => {
    if(playerScores[activePlayerScore] >= 10000){
      setGameOver(true);
      window.alert(`${playerNames[currentPlayerIndex]} YOU WIN !`)
    }
  }


  // Gestionnaire de clic pour commencer la partie avec le nombre de joueurs choisi
  const handleStartGame = () => {
    setDice([]);
    setSavedDice([]);
    setShowSaveButton(false);
    setCurrentPlayerIndex(0);
    setGameStarted(true); 
    setActivePlayerScore(0); 
    setGameOver(false); 
  };

  // Gestionnaire de clic pour passer au joueur suivant
  const handleNextPlayer = () => {
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % numPlayers);
    setDice([]);
    setSavedDice([]);
    setShowSaveButton(false);
    setActivePlayerScore(0); 
    checkWin();
  };

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
  const handleRollDice = () => {
      if(dice.length === 0) {
        const newDice = [];
        for (let i = 0; i < 6; i++) {
          newDice.push(getRandomDiceRoll());
        }

        // Mettre à jour les dés
        setDice(newDice);
        console.log(activePlayerScore)
        // Vérifier si c'est un Game Over
        const result = calculateFinalScore(newDice)
        // Game Over
        if (result === 0) {
          alert("Dommage pas un seul bon dé")
          setShowSaveButton(false)
          setActivePlayerScore(0)
          handleNextPlayer()
          console.log(activePlayerScore)
          return;
        } 
        setShowSaveButton(true);

      }else {
        const newDice = [...dice];
        for (let i = 0; i < newDice.length ; i++) {
          newDice[i] = getRandomDiceRoll()
        }

        // Vérifier si c'est un Game Over
        const result = calculateFinalScore(newDice);
        console.log('result', result)
        if (result === 0) {
          // Game Over
          alert("Echec ! Dommage vous y étiez presque")
          setShowSaveButton(false)
          setActivePlayerScore(0)
          handleNextPlayer()
          return;
        } else{
          setDice(newDice)
        }

      }
  };

  // Fonction pour calculer le score en utilisant les chiffres sauvegardés
  const calculateFinalScore = (dice: number[]) => {
    const counts = [0, 0, 0, 0, 0, 0]
    //score de base
    let totalScore = 0;
    for (const value of dice) {
      counts[value - 1]++;
  }

  //algorithme de calcul
  for (let i = 0; i < 6; i++) {
    if (counts[i] >= 3) {
      if (i === 0) {
        totalScore += 1000;
      } else {
        totalScore += (i + 1) * 100; 
      }
      counts[i] -= 3;
      }
      else if (i === 0) {
        totalScore += counts[i] * 100;
      } else if (i === 4) {
        totalScore += counts[i] * 50;
      }
      else if (counts[i] === 4) {
        if (i === 0) {
          totalScore += 2000; 
        } else {
          totalScore += (i + 1) * 100 * 2; 
        }
        counts[i] -= 4;
      }
      else if (counts[i] === 5) {
        if (i === 0) {
          totalScore += 4000; 
        } else {
          totalScore += (i + 1) * 100 * 2 * 2; 
        }
        counts[i] -= 5;
      }
      else if (counts[i] === 6) {
        if (i === 0) {
          totalScore += 8000; 
        } else {
          totalScore += (i + 1) * 100 * 2 * 2 * 2; 
        }
        counts[i] -= 6;
      }
    }
    return totalScore;
  };

  // Calculer le score du lancer de dés
  const result = calculateFinalScore(dice);

  // Fonction pour sauvegarder le score du joueur actif
  const handleSaveScore = () => {
    const calculatedFinalScore = calculateFinalScore(savedDice);
    setPlayerScores((prevScores) => {
      const newScores = [...prevScores];
      newScores[currentPlayerIndex] += calculatedFinalScore;
      return newScores;
    });
    setActivePlayerScore((prevScore) => prevScore + calculatedFinalScore);
    setSavedDice([]);
  };

  return (
    <div>
      {/* Sélection du nombre de joueurs */}
      {!gameStarted && (
        <div>
          <p>Choisissez le nombre de joueurs :</p>
          <select onChange={(e) => setNumPlayers(parseInt(e.target.value))}>
            <option value={2}>2 joueurs</option>
            <option value={3}>3 joueurs</option>
            <option value={4}>4 joueurs</option>
          </select>
          <button onClick={handleStartGame}>Commencer à jouer</button>
        </div>
      )}

      {gameStarted && (
        <div>
          <h2>
            {playerNames[currentPlayerIndex]} (Actif)
            <div>Score : {playerScores[currentPlayerIndex]} </div>
          </h2>
          <div>
            <button onClick={handleRollDice}>Lancer les dés</button>
            <div>Résultats des lancers de dé :  {dice.map((number, index) => (
                <button key={index} onClick={() => handleSaveDice(number)}>
                  {number}
                </button>
              ))}
            </div>
            <div>Votre score est de : {result}</div>
            <div>Mes dés sauvegardés : {savedDice.map((number, index) => (
                <button key={index} onClick={() => handleReturnToDice(number)}>
                  {number}
                </button>
              ))}
              {showSaveButton && (
              <button onClick={handleSaveScore}>Mettre de côté</button>
              )}
            </div>
            <div className="final-score">
              Final Score : {activePlayerScore}
            </div>
          </div>
          <button onClick={handleNextPlayer}>Joueur suivant</button>
          <div>
            {playerNames.map((playerName, index) => {
              if (index !== currentPlayerIndex) {
                return (
                  <div key={index}>
                    {playerName} : {playerScores[index]}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

  </div>
  );
}

export default Greed;



{/* <div id="greedRules">
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
</div> */}
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
