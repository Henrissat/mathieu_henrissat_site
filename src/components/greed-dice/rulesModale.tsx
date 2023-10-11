import React from 'react';
import './rulesModale.scss'

interface RulesModaleProps {
    onClose: () => void; 
}

function RulesModale({ onClose }: RulesModaleProps) {
  return (
    <div className="rules-modale">
        <div className="rules-container">
            <div>
                <h2>Règles du jeu du 10 000</h2>
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
            </div>
            <div>
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
      <button onClick={onClose}>Fermer</button>
    </div>
  );
}

export default RulesModale;