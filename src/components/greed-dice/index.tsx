import { useState } from "react";
import { getRandomDiceRoll } from "../../utils/diceRoll6";
import "./greed-dice.scss"
import avatar1 from '../../../public/player_avatar-1.png';
import avatar2 from '../../../public/player_avatar-2.png';
import avatar3 from '../../../public/player_avatar-3.png';
import avatar4 from '../../../public/player_avatar-4.png';

function Greed() {
  const [dice, setDice] = useState<number[]>([])
  const [savedDice, setSavedDice] = useState<number[]>([])
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false)
  const [numPlayers, setNumPlayers] = useState<number>(2);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)

  const [playerNames, setPlayerNames] = useState<string[]>(["Joueur 1", "Joueur 2", "Joueur 3", "Joueur 4"])

  const initialPlayerScores = Array(numPlayers).fill(0)
  const [playerScores, setPlayerScores] = useState<number[]>(initialPlayerScores)
  const [activePlayerScore, setActivePlayerScore] = useState<number>(0)
  const [firstTurn, setFirstTurn] = useState<boolean>(true)
  const [hasSavedDiceThisTurn, setHasSavedDiceThisTurn] = useState<boolean>(false)


  const checkWin = () => {
    if(activePlayerScore >= 10000){
      setGameOver(true);
      window.alert(`${playerNames[currentPlayerIndex]} YOU WIN !`)
    }
  }

  console.log("numPlayers", numPlayers)
  // Gestionnaire de clic pour commencer la partie avec le nombre de joueurs choisi
  const handleStartGame = () => {
    setDice([]);
    setSavedDice([]);
    setShowSaveButton(false);
    setCurrentPlayerIndex(0);
    setGameStarted(true); 
    setActivePlayerScore(0); 
    setGameOver(false); 

    //Mise à jour nombre de joueurs et le score
    const updatedPlayerNames = Array.from({ length: numPlayers }, (_, index) => `${index + 1}`);
    setPlayerNames(updatedPlayerNames);
    const updatedPlayerScores = Array(numPlayers).fill(0);
    setPlayerScores(updatedPlayerScores);
  };

  // Gestionnaire de clic pour passer au joueur suivant
  const handleNextPlayer = () => {
    if (activePlayerScore >= 1000 || playerScores[currentPlayerIndex] >= 1000) {
      if (activePlayerScore  === 0) {
        setActivePlayerScore(0);
      } else {
        setPlayerScores((prevScores) => {
          const newScores = [...prevScores];
          newScores[currentPlayerIndex] += activePlayerScore;
          return newScores;
        });
      }
    } else {
      alert("Vous devez atteindre au moins 1000 points pour commencer à comptabiliser vos points.");
    }
    
    setDice([]);
    setSavedDice([]);
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % numPlayers);
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
    setHasSavedDiceThisTurn(true);
  };

  // Gestionnaire de clic pour faire revenir un chiffre dans dice
  const handleReturnToDice = (number: number) => {
    setDice([...dice, number]);
    // Trouver et retirer le chiffre de savedNumbers
    const index = savedDice.indexOf(number);
    if (index !== -1) {
      const newSaveDice = [...savedDice]
      newSaveDice.splice(index, 1)
      setSavedDice(newSaveDice)
    }
  };

  // Texte Aléatoire
  function textGameOver(){
    var text = ['Ooops, pas un seul bon dé','You loose, pas un seul bon dé','AH AH AH, pas un seul bon dé, suivant']
    return text[Math.floor(Math.random() * text.length)]
  }

  // Gestionnaire de clic pour ajouter 6 lancers de dé au tableau
  const handleRollDice = () => {
    let shouldResetDiceAndScore = false

    // Vérifier si le joueur a sauvegardé au moins un dé ce tour
    if (!hasSavedDiceThisTurn && !firstTurn) {
      alert("Vous devez sauvegarder au moins un dé avant de lancer les dés.");
    } else {
      if(dice.length === 0) {
        const newDice = []
        for (let i = 0; i < 6; i++) {
          newDice.push(getRandomDiceRoll())
        }
        // Mettre à jour les dés
        setDice(newDice);
        console.log(activePlayerScore)
        // Vérifier si c'est un Game Over
        const result = calculateFinalScore(newDice)
        // Game Over
        if (result === 0) {
          alert({textGameOver})
          setActivePlayerScore(0);
          shouldResetDiceAndScore= true
        } 
        setShowSaveButton(true)
        setHasSavedDiceThisTurn(false)
        setFirstTurn(false);
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
          setActivePlayerScore(0)
          shouldResetDiceAndScore= true
        }
        setDice(newDice)
        setHasSavedDiceThisTurn(false)
        setFirstTurn(false);
      }
    }
      
    if (shouldResetDiceAndScore) {
      setDice([])
      setSavedDice([])
      setShowSaveButton(false)
      handleNextPlayer()
    }
  };

  // Fonction pour calculer le score en utilisant les chiffres sauvegardés
  const calculateFinalScore = (dice: number[]) => {
    const counts = [0, 0, 0, 0, 0, 0]
    let totalScore = 0
  
    for (const value of dice) {
      counts[value - 1]++
    }
  
    console.log('dice', dice)
    // Vérifier si le lancer de dés forme une suite
    const uniqueDiceValues = Array.from(new Set(dice));
    const sortedDice = uniqueDiceValues.sort((a, b) => a - b)
    console.log('sortedDice', sortedDice)

    
    const isStraight = () => {
      if (sortedDice.length !== 5) {
        return false;
      } else {
        return sortedDice[4] - sortedDice[0] === 4;
      }
    };

    // Vérifier si le joueur a obtenu une suite
    let gotStraight = false;
    const remainingDice = [...dice];

    if (isStraight()) {
      gotStraight = true;
      // Le joueur a obtenu une suite, attribuer 1000 points et marquer le drapeau
      totalScore += 1000;
     // Calculer le score pour les dés restants
      const nonStraightDice = dice.filter((value) => !sortedDice.includes(value));
      const ones = nonStraightDice.filter((value) => value === 1);
      totalScore += ones.length * 100;
      const fives = nonStraightDice.filter((value) => value === 5);
      totalScore += fives.length * 50;
    } else {
      for (let i = 0; i < 6; i++) {
        if (counts[i] === 3) {
          if (i === 0) {
            totalScore += 1000 * (i + 1) * (counts[i] - 2);
          } else {
            totalScore += (i + 1) * 100 * (counts[i] - 2);
          }
          counts[i] -= 3;
        } else if (counts[i] === 4) {
          if (i === 0) {
            totalScore += 1000 * (i + 1) * 2;
          } else {
            totalScore += (i + 1) * 100 * 2;
          }
          counts[i] -= 4;
        } else if (counts[i] === 5) {
          if (i === 0) {
            totalScore += 1000 * (i + 1) * 4;
          } else {
            totalScore += (i + 1) * 100 * 4;
          }
          counts[i] -= 5;
        } else if (counts[i] === 6) {
          if (i === 0) {
            totalScore += 1000 * (i + 1) * 8;
          } else {
            totalScore += (i + 1) * 100 * 6;
          }
          counts[i] -= 6;
        }
      }
      // Ajouter le score pour les 1 et les 5 restants
      if (counts[0] > 0) {
        totalScore += counts[0] * 100;
      }
      if (counts[4] > 0) {
        totalScore += counts[4] * 50;
      }
      }

    return totalScore;
  };
  
  // Calculer le score du lancer de dés
  const result = calculateFinalScore(dice);

  // Fonction pour sauvegarder le score du joueur actif
  const handleSaveScore = () => {
    const calculatedFinalScore = calculateFinalScore(savedDice);
    setSavedDice([]);
    
    const scoreToAddLater = activePlayerScore + calculatedFinalScore;
    setActivePlayerScore(scoreToAddLater);
  };

  console.log('hasSavedDiceThisTurn',hasSavedDiceThisTurn)
  console.log('playerScores',playerScores)
  console.log('activePlayerScore',activePlayerScore)

  return (
    <div>
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
        <div className="game">
          <div className="container-panel">
            <div className="screen-dice">
              <div className="save-score">{activePlayerScore}</div>
              <div className="dice-panel">
                <div className="inner-div-panel">{dice.map((number, index) => (
                    <button key={index} className="roll-dice-panel" onClick={() => handleSaveDice(number)} >
                      {number}
                    </button>
                  ))}
                </div>
                <div className="inner-div-panel">{savedDice.map((number, index) => (
                    <button key={index} className="roll-dice-panel" onClick={() => handleReturnToDice(number)}>
                      {number}
                    </button>
                  ))}
                </div>
              </div>
              {showSaveButton && (
                <button onClick={handleSaveScore} className="btn-save-dice">Mettre de côté</button>
                )}
            </div>
            <div className="player-panel">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="players-screen">
                  {playerNames[index] ? (
                    <>
                    <div
                      className="players-screen"
                      style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/player_avatar-${index}.png)`
                      }}
                    ></div>
                    <div className="score-final-players">{playerScores[index]}</div>
                    <div className="player-number">{playerNames[index]}</div>
                    </>
                  ) : (
                    <div className="empty-avatar">
                      <div className="score-final-players"></div>
                      <div className="player-number"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="container-game">
            <div className="bg-light"></div>
            <div id="wrap">
              {dice.map((number, index ) => (
                <button className="die" key={index} onClick={() => handleSaveDice(number)}>
                  <div className="die-inner" data-roll={number}>
                    <div className="die-side"></div>
                    <div className="die-side"></div>
                    <div className="die-side"></div>
                    <div className="die-side"></div>
                    <div className="die-side"></div>
                    <div className="die-side"></div>
                  </div>
                </button>
              ))}
            </div>
            <div className="score-activ-player">            
              <div className="text-activ-player-score">
              Joueur {playerNames[currentPlayerIndex]} | Score : {playerScores[currentPlayerIndex]}
              </div>
            </div>
            <div className="final-score"><span>{result}</span></div>
            <button className="btn-end-turn" onClick={handleNextPlayer} >Finir mon tour</button>
            <button className="btn-roll-dice" onClick={handleRollDice}>Lancer les dés</button>
          </div>
        </div>
      )}
    <div id="greedRules">
      <h2>Règles du jeu deu 10</h2>
      <h3>But du jeu :</h3>
      <p>Atteindre un score de 10 000 points.</p>
      <h2>Déroulement du jeu :</h2>
      <p>Les joueurs jouent les uns après les autres.</p>
      <h3>Description d'un tour de jeu :</h3>
      <ol>
        <li>Jeter les 5 dés.</li>
        <li>Mettre de côté le ou les dés permettant de gagner des points et toujours au minimum un dés</li>
        <li>Si on le souhaite arrêter, laisser la main au joueur suivant et additionner le score obtenu lors du tour aux points déjà acquis lors des autres tours.</li>
        <li>Ou si on préfère lancer les dés non utilisés dans l'espoir de faire grimper le score obtenu lors du tour.</li>
        <li>Si l'un des jets de dés ne rapporte rien, le score du tour du jeu est nul, et c'est au joueur suivant de lancer les 5 dés.</li>
      </ol>
      <h3>Comptage des points :</h3>
      <ul>
        <li>Un As : 100 pts</li>
        <li>Un 5 : 50 pts</li>
        <li>Brelan d'As : 1000 pts</li>
        <li>Brelan de 5 : 500 pts</li>
        <li>Brelan de 2, 3, 4, 6 : 200, 300, 400, 600 pts</li>
        <li>Carré de 2, 3, 4, 6 : 200*2, 300*2, 400*2, 600*2 pts</li>
        <li>5 dés identique de 2, 3, 4, 6 : 200*4, 300*4, 400*4, 600*4 pts</li>
        <li>6 dés identique de 2, 3, 4, 6 : 200*6, 300*6, 400*6, 600*6 pts</li>
        <li>Suite : 1, 2, 3, 4, 5 ou 2, 3, 4, 5, 6 : 1000 pts</li>
      </ul>
      <h4>Remarque 1 :</h4>
      <p>Pour être valides, les brelans ou suites doivent être produits sur un seul jeté de dé. Exemple :</p>
      <ol>
        <li>On obtient 1, 3, 4, 4, 6 au premier lancé : Seul le 1 permet d'augmenter le score du tour (+100 pts). On le garde et on relance les autres dés.</li>
        <li>On obtient 5, 3, 3, 4 : Seul le 5 permet d'augmenter le score du tour (+50 pts, soit 150 au total). On le garde et on relance les autres dés.</li>
        <li>On obtient 2, 3, 4 : Rien ne permet de marquer avec ces 3 dés (même si les 5 dés constituent une suite), les 150 points sont perdus.</li>
      </ol>
      <h4>Remarque 2 :</h4>
      <p>Lorsque les 5 dés ont permis de marquer, ils peuvent tous être relancés en vue d'améliorer le score du tour (au risque de le perdre entièrement).</p>
      <h4>Remarque 3 :</h4>
      <p>Il faut totaliser 1000 points avant de pouvoir commencer à comptabiliser ses points.</p>

    </div>
  </div>
  );
}

export default Greed;

