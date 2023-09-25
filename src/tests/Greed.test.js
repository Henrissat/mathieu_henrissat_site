import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Greed from '../components/greed-dice';


describe('Greed Component', () => {
  it('affiche le bouton "Lancer les dés"', () => {
    const { getByText } = render(<Greed/>);
    const buttonElement = getByText('Lancer les dés');
    expect(buttonElement).toBeInTheDocument();
  });

  it('lance les dés lors du clic sur le bouton', () => {
    const { getByText } = render(<Greed />);
    const buttonElement = getByText('Lancer les dés');
    fireEvent.click(buttonElement);

    const diceElements = document.querySelectorAll('.dice');

    diceElements.forEach((diceElement) => {
      const diceValue = parseInt(diceElement.textContent, 10);
      expect(diceValue).toBeGreaterThanOrEqual(1);
      expect(diceValue).toBeLessThanOrEqual(6);
    });
  });
  
  it('le bouton "Sauvegarder mon score" met le score dans finalScore', () => {
    const { getByText } = render(<Greed />);
    const rollDiceButton = getByText('Lancer les dés');
  
    fireEvent.click(rollDiceButton);

    const saveScoreButton = getByText('Sauvegarder mon score');
    expect(saveScoreButton).toBeInTheDocument();
  
    fireEvent.click(saveScoreButton); 
    const finalScoreElement = document.querySelector('.final-score');
    expect(finalScoreElement.textContent).toContain('Final Score : 0');
  });

});
