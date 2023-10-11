import { Suspense, useEffect, useState } from "react";
import { getRandomDiceRoll } from "../../utils/diceRoll6";
import "./greedDice.scss";
import LoadingGreed from "./loaderGreed";
import RulesModale from "./rulesModale";


function Greed() {
  const [introSoundPlayed, setIntroSoundPlayed] = useState(false);
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
    setDice([1,2,3,4,5]);
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
    
    setDice([1,2,3,4,5]);
    setSavedDice([]);
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % numPlayers);
    setShowSaveButton(false);
    setActivePlayerScore(0);
    setHasSavedDiceThisTurn(true);
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
    const audioRollDice = new Audio('https://res.cloudinary.com/doe4mucdz/video/upload/v1697016359/roll_yhf47d.wav');
    audioRollDice.play();

    // Vérifier si le joueur a sauvegardé au moins un dé ce tour
    if (!hasSavedDiceThisTurn && !firstTurn) {
      alert("Vous devez sauvegarder au moins un dé avant de lancer les dés.");
    } else {
              setShowSaveButton(true)
      if(dice.length === 0) {
        const newDice = []
        for (let i = 0; i < 5; i++) {
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
          setTimeout(() => {
            alert("Aucun bon dés ! Dommage vous y étiez presque");
            setActivePlayerScore(0);
          }, 1000);
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
    const counts = [0, 0, 0, 0, 0]
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
      if (sortedDice.length !== 4) {
        return false;
      } else {
        return sortedDice[3] - sortedDice[0] === 3;
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
  let result = 0; // Initialiser result à 0 par défaut

  if (!firstTurn) {
    result = calculateFinalScore(dice);
  }


  // Fonction pour sauvegarder le score du joueur actif
  const handleSaveScore = () => {
    const calculatedFinalScore = calculateFinalScore(savedDice);
    setSavedDice([]);
    
    const scoreToAddLater = activePlayerScore + calculatedFinalScore;
    setActivePlayerScore(scoreToAddLater);
  };


  const [showRules, setShowRules] = useState(false);

  const openRules = () => {
    setShowRules(true);
  };

  const closeRules = () => {
    setShowRules(false);
  };

  const playSoundOnMouseEnter = () => {
    if (!introSoundPlayed) {
      const audio = new Audio('https://res.cloudinary.com/doe4mucdz/video/upload/v1697016041/epic-logo-6215_f8vltv.mp3');
      audio.play();
      setIntroSoundPlayed(true);
    }
  };

  return (
    <Suspense fallback={<LoadingGreed />}>
      {!gameStarted && (
        <div className="container-home-greed" onMouseEnter={playSoundOnMouseEnter}>
          <div className="box-left">
            <div className="container-box-left">
              <div className="box-left-img"/>
              <div className="box-left-shadow"/>
            </div>
          </div>
          <div className="box-right">
            <div className="container-box-right">
              <div className="box-right-img"/>
              <div className="box-right-shadow"/>
            </div>
          </div>
          <div className="home-greed">
            <div className="board-begin">
              <p>Choisissez le nombre de joueurs :</p>
              <select onChange={(e) => setNumPlayers(parseInt(e.target.value))}>
                <option value={2}>2 joueurs</option>
                <option value={3}>3 joueurs</option>
                <option value={4}>4 joueurs</option>
              </select>
              <button onClick={handleStartGame}>Commencer à jouer</button>
            </div>
          </div>
        </div>
      )}
      {gameStarted && (
          <div className="game">
            <div className="container-panel">
              <div className="screen-dice">
                <div className="save-score">{activePlayerScore}</div>
                <div className="dice-panel">
                  <div className="inner-div-panel">
                    {dice.map((number, index ) => (
                      <button className="die-sm" key={index} onClick={() => handleSaveDice(number)}>
                        <div className="die-sm-quick" data-roll={number}>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                        </div>
                        {/* <span className="shadow-dice"/> */}
                      </button>
                    ))}
                  </div>
                  <div className="inner-div-panel">
                    {savedDice.map((number, index ) => (
                      <button className="die-sm" key={index} onClick={() => handleReturnToDice(number)}>
                        <div className="die-sm-quick" data-roll={number}>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                          <div className="die-sm-side"></div>
                        </div>
                        {/* <span className="shadow-dice"/> */}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="final-score" onClick={handleSaveScore}>{result}</button>
              <div className="mobile-btn">
                {showSaveButton && (
                    <button className="btn btn-save-dice" onClick={handleSaveScore} >
                    <p>Sauvegarder dés</p>
                    <span className="btn-save-dice-img1"/>
                  </button>
                )}
                <button className="btn btn-end-turn" onClick={handleNextPlayer}>
                  <p>Suivant</p>
                  <span className="btn-end-turn-img1" />
                </button>
                <button className="btn btn-roll-dice" onClick={handleRollDice}>
                  <p>Lancer les dés</p>
                  <span className="btn-roll-dice-img" />
                </button>
              </div>
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
              <div className="bg-logo-mobile"></div>
            </div>
            <div className="container-game">
              <div className="bg-light-effect"/>
              <div className="bg-light"></div>
              <div className="bg-logo"></div>
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
                    <span className="shadow-dice"/>
                  </button>
                ))}
              </div>
              <div className="score-activ-player">            
                <div className="text-activ-player-score">
                Joueur {playerNames[currentPlayerIndex]} | Score : {playerScores[currentPlayerIndex]}
                </div>
              </div>
              {showSaveButton && (
                  <button className="btn btn-save-dice" onClick={handleSaveScore} >
                  <p>Sauvegarder dés</p>
                  <span className="btn-save-dice-img1" />
                </button>
              )}
              <button className="btn btn-end-turn" onClick={handleNextPlayer}>
                <p>Suivant</p>
                <span className="btn-end-turn-img1" />
              </button>
              <button className="btn btn-roll-dice" onClick={handleRollDice}>
                <p>Lancer les dés</p>
                <span className="btn-roll-dice-img" />
              </button>
            </div>
            <div className="greedRules">
              <button onClick={openRules}>Afficher les règles</button>

              {showRules && <RulesModale onClose={closeRules} />}
            </div>
          </div>
      )}
  </Suspense>
  );
}

export default Greed;