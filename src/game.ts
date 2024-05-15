const numberOfPlayers = 5;
let currentTurn = 0; // Ajout du suivi du tour actuel
const specialButton = document.getElementById('specialButton');
const nextButton = document.getElementById('nextButton');

enum CardType {
  desamorchage,
  bombe,
  attaque,
  non,
  melanger,
  divination,
  paire,
  faveur,
  passeSonTour
}

class Utils {
  static shuffle(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
}

interface Card {
  name: string;
  description: string;
  action: string;

  power(deck: Card[] | number, playerDeck?: PlayerDeck): void;
}

class cardFactory {
  static createCard(type: CardType): Card {
    switch (type) {
      case CardType.desamorchage:
        return new Desamorchage();
      case CardType.bombe:
        return new Bombe();
      case CardType.attaque:
        return new Attaque();
      case CardType.non:
        return new Non();
      case CardType.melanger:
        return new Melanger();
      case CardType.divination:
        return new Divination();
      case CardType.paire:
        return new Paire('Paire', 'Echangez votre main avec celle d’un adversaire.');
      case CardType.faveur:
        return new Faveur();
      case CardType.passeSonTour:
        return new PasseSonTour();
      default:
        throw new Error('Invalid card type');
    }
  }
}

class Desamorchage implements Card {
  name = 'Desamorchage';
  description = 'Neutralise une Bombe.';
  action = 'Neutralize';

  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Desamorchage : Neutralise une Bombe.');
    console.log(deck);
  }
}

class Bombe implements Card {
  name = 'Bombe';
  description = 'Vous explosez si vous piochez cette carte sans désamorçage.';
  action = 'Explode';

  power(deck: Card[], playerDeck: PlayerDeck): void {
    console.log('Pouvoir de la carte Bombe : Vous explosez si vous piochez cette carte sans désamorçage.');
    console.log(deck);
  }
}

class PasseSonTour implements Card {
  name = 'PasseSonTour';
  description = 'Passez votre tour.';
  action = 'Skip your turn.';

  power(deck: Card[] | number, playerDeck?: PlayerDeck): void {
    console.log('Pouvoir de la carte PasseSonTour : Passez votre tour.');
    currentTurn = (currentTurn + 1) % numberOfPlayers;
    updateTurnDisplay();
    displayCurrentPlayerCards();
  }
}

class Attaque implements Card {
  name = 'Attaque';
  description = 'La victime pioche 2 cartes.';
  action = 'Draw 2 cards.';

  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Attaque : La victime pioche 2 cartes.');
    deck.push(...deck.slice(deck.length - 2));
  }
}

class Non implements Card {
  name = 'Non';
  description = 'Neutralise une Attaque.';
  action = 'Neutralize';

  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Non : Neutralise une Attaque.');
  }
}

class Melanger implements Card {
  name = 'Melanger';
  description = 'Mélangez votre main avec celle d’un adversaire.';
  action = 'Shuffle your hand with an opponent.';

  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Melanger : Mélangez votre main avec celle d’un adversaire.');
  }
}

class Divination implements Card {
  name = 'Divination';
  description = 'Pouvoir de la carte Divination : Visualiser trois premières cartes du deck.';
  action = 'Look at an opponent\'s hand.';

  power(deck: Card[]): void {
    console.log(this.description);
    for (let i = 0; i < 3; i++) {
      console.log(deck[i]);
    }
  }
}

class Paire implements Card {
  name: string;
  description: string;
  action = 'Swap your hand with an opponent\'s hand.';

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Paire : Echangez votre main avec celle d’un adversaire.');
  }
}

class Faveur implements Card {
  name = 'Faveur';
  description = 'Echangez votre main avec celle du joueur de votre choix.';
  action = 'Swap your';

  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Faveur : Echangez votre main avec celle du joueur de votre choix.');
  }
}

class Deck {
  cards: Card[];

  constructor() {
    this.cards = this.buildDeck();
  }

  drawCard(): Card | undefined {
    return this.cards.pop();
  }

  private buildDeck() {
    const deck: Card[] = [];

    deck.push(...this.createMultipleCards(CardType.desamorchage, 6));
    deck.push(...this.createMultipleCards(CardType.bombe, 4)); // Ensure exactly 4 bombs
    deck.push(...this.createMultipleCards(CardType.attaque, 8));
    deck.push(...this.createMultipleCards(CardType.non, 5));
    deck.push(...this.createMultipleCards(CardType.melanger, 4));
    deck.push(...this.createMultipleCards(CardType.divination, 3));
    deck.push(...this.createMultipleCards(CardType.paire, 8));
    deck.push(...this.createMultipleCards(CardType.faveur, 7));
    deck.push(...this.createMultipleCards(CardType.passeSonTour, 5));

    Utils.shuffle(deck);

    return deck;
  }

  private createMultipleCards(cardType: CardType, count: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      cards.push(cardFactory.createCard(cardType));
    }
    return cards;
  }
}

const mainDeck = new Deck();

class PlayerDeck {
  cards: Card[];

  constructor() {
    this.cards = [];
  }

  addCard(card: Card) {
    this.cards.push(card);
  }

  initPlayerDeck() {
    this.cards = [];
    while (this.cards.length < 7) {
      const card = mainDeck.drawCard();
      if (card && !(card instanceof Bombe)) {
        this.addCard(card);
      } else {
        // Put the bomb back and reshuffle to keep 4 bombs in the deck
        mainDeck.cards.unshift(card!);
        Utils.shuffle(mainDeck.cards);
      }
    }
  }

  drawCardFromDeck() {
    const card = mainDeck.drawCard();

    if (card && !(card instanceof Bombe)) {
      this.addCard(card);
    }

    if (card instanceof Bombe) {
      console.log(`Joueur ${currentTurn + 1} a pioché une bombe !`);

      const findIndexDesamorchage = playerDecks[currentTurn].cards.findIndex(card => card instanceof Desamorchage);

      if (findIndexDesamorchage !== -1) {
        playerDecks[currentTurn].cards = [];
      } else {
        playerDecks[currentTurn].cards.slice(findIndexDesamorchage, 1);
      }

    }
  }

  checkPlayerDeck(player: number) {
    console.log(`Joueur ${player} : `, this.cards);
  }
}

let playerDecks: PlayerDeck[] = [];

function checkPlayerDeck(player: number) {
  if (playerDecks[player - 1]) {
    console.log(`Joueur ${player} : `, playerDecks[player - 1].cards);
  } else {
    console.log(`Le deck du joueur ${player} n'a pas encore été créé.`);
  }
}

function displayCurrentPlayerCards() {
  const playerDeck = playerDecks[currentTurn];
  const playerDeckDiv = document.getElementById('specialDisplay');

  if (playerDeckDiv) {
    playerDeckDiv.innerHTML = ''; // Clear previous cards

    playerDeck.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.textContent = `${index + 1}. ${card.name} - ${card.description}`;
      cardElement.classList.add('card');

      cardElement.addEventListener('click', () => {
        console.log(`Carte cliquée : ${card.name}`);
        if (card instanceof PasseSonTour) {
          card.power(currentTurn);
        } else {
          card.power(mainDeck.cards, playerDeck);
        }
        displayRemainingDeckCards(); // Mettre à jour l'affichage des cartes restantes après chaque action
      });
      playerDeckDiv.appendChild(cardElement);
    });
  }
}

function displayRemainingDeckCards() {
  const remainingDeckDiv = document.getElementById('remainingDeckDisplay');

  if (remainingDeckDiv) {
    remainingDeckDiv.innerHTML = ''; // Clear previous cards

    mainDeck.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.textContent = `${index + 1}. ${card.name} - ${card.description}`;
      cardElement.classList.add('card');
      remainingDeckDiv.appendChild(cardElement);
    });
  }
}

function updateTurnDisplay() {
  const tourDisplay = document.getElementById('tourDisplay');
  if (tourDisplay) {
    tourDisplay.textContent = `Tour : Joueur ${currentTurn + 1}`;
  }
}

// Shuffle the main deck
Utils.shuffle(mainDeck.cards);

function main() {
  for (let i = 0; i < numberOfPlayers; i++) {
    const playerDeck = new PlayerDeck();
    playerDeck.initPlayerDeck();
    playerDecks.push(playerDeck);
  }

  checkPlayerDeck(1);
  checkPlayerDeck(2);
  checkPlayerDeck(3);
  checkPlayerDeck(4);
  checkPlayerDeck(5);

  console.log('Deck principal après distribution : ', mainDeck.cards);

  updateTurnDisplay(); // Initialiser l'affichage du tour actuel
  displayRemainingDeckCards(); // Initialiser l'affichage des cartes restantes
}

specialButton?.addEventListener('click', () => {
  console.log('C\'est au tour du joueur : ', currentTurn + 1);
  displayCurrentPlayerCards();
});

nextButton?.addEventListener('click', () => {
  playerDecks[currentTurn].drawCardFromDeck(); // Le joueur actuel pioche une carte du deck
  currentTurn = (currentTurn + 1) % numberOfPlayers;
  console.log('C\'est au tour du joueur : ', currentTurn + 1);
  updateTurnDisplay();
  displayCurrentPlayerCards();
  displayRemainingDeckCards();
});

export { main };
