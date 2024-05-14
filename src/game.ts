const nextButton = document.getElementById('nextButton');
const specialButton = document.getElementById('specialButton');

let tour = 0;
const numberOfPlayers = 4;

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

interface Card {
  name: string;
  description: string;
  action: string;

  power(deck: Card[] | number): void;
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

  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Bombe : Vous explosez si vous piochez cette carte sans désamorçage.');
    console.log(deck);
  }
}

class PasseSonTour implements Card {
  name = 'PasseSonTour';
  description = 'Passez votre tour.';
  action = 'Skip your turn.';

  power(tour: number): void {
    console.log('Pouvoir de la carte PasseSonTour : Passez votre tour.');
    tour = (tour + 1) % numberOfPlayers;
    updateTurnDisplay();
    displayPlayerCards();
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

  //  @ts-ignore
  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Non : Neutralise une Attaque.');
  }
}

class Melanger implements Card {
  name = 'Melanger';
  description = 'Mélangez votre main avec celle d’un adversaire.';
  action = 'Shuffle your hand with an opponent.';

  // @ts-ignore
  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Melanger : Mélangez votre main avec celle d’un adversaire.');
  }
}

class Divination implements Card {
  name = 'Divination';
  description = 'Pouvoir de la carte Divination : Visualiser trois premières cartes du deck.';
  action = 'Look at an opponent\'s hand.';

  // @ts-ignore
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


  // @ts-ignore
  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Paire : Echangez votre main avec celle d’un adversaire.');
  }
}

class Faveur implements Card {
  name = 'Faveur';
  description = 'Echangez votre main avec celle du joueur de votre choix.';
  action = 'Swap your';

  // @ts-ignore
  power(deck: Card[]): void {
    console.log('Pouvoir de la carte Faveur : Echangez votre main avec celle du joueur de votre choix.');
  }
}

class cardFactory {
  static createCard(type: CardType) {
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
    }
  }
}

class Deck {
  cards: Card[];

  constructor() {
    this.cards = this.buildDeck();
  }

  drawCard(): void {
    this.cards.pop();
  }

  private buildDeck() {
    const deck: Card[] = [];

    deck.push(...this.createMultipleCards(CardType.desamorchage, 6));
    deck.push(...this.createMultipleCards(CardType.bombe, 4));
    deck.push(...this.createMultipleCards(CardType.attaque, 8));
    deck.push(...this.createMultipleCards(CardType.non, 5));
    deck.push(...this.createMultipleCards(CardType.melanger, 4));
    deck.push(...this.createMultipleCards(CardType.divination, 3));
    deck.push(...this.createMultipleCards(CardType.paire, 8));
    deck.push(...this.createMultipleCards(CardType.faveur, 7));
    deck.push(...this.createMultipleCards(CardType.passeSonTour, 5));

    this.shuffle(deck);
    return deck;
  }

  private shuffle(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  private createMultipleCards(cardType: CardType, count: number): Card[] {
    const cards: Card[] = [];
    for (let i = 0; i < count; i++) {
      cards.push(cardFactory.createCard(cardType));
    }
    return cards;
  }
}

class PlayerDeck {
  cards: Card[];

  constructor() {
    this.cards = this.buildPlayerDeck();
  }

  checkPlayerDeck(player: number) {
    console.log(`Joueur ${player} : `, this.cards);
  }

  private buildPlayerDeck(): Card[] {
    const playerDeck: Card[] = [];
    const availableCardTypes = [
      CardType.desamorchage,
      CardType.attaque,
      CardType.non,
      CardType.melanger,
      CardType.divination,
      CardType.paire,
      CardType.faveur,
      CardType.passeSonTour,
    ];

    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * availableCardTypes.length);
      const randomCardType = availableCardTypes[randomIndex];
      playerDeck.push(cardFactory.createCard(randomCardType));
    }

    return playerDeck;
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

const deck = new Deck();

function main() {
  console.log('Deck principal : ', deck.cards);

  for (let i = 0; i < 4; i++) {
    const playerDeck = new PlayerDeck();
    playerDecks.push(playerDeck);
    console.log(`Joueur ${i + 1} : `, playerDeck.cards);
    for (let j = 0; j < 7; j++) {
      deck.drawCard();
    }
  }

  console.log('Deck principal après distribution : ', deck.cards);
}

function updateTurnDisplay() {
  const tourDisplay = document.getElementById('tourDisplay');
  if (tourDisplay) {
    tourDisplay.textContent = `Tour : ${tour}`;
  }
}

function displayPlayerCards() {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = ''; // Clear previous cards

    const currentPlayerDeck = playerDecks[tour];
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');

    currentPlayerDeck.cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.textContent = `${index + 1}. ${card.name} - ${card.description}`;
      cardElement.classList.add('card');

      cardElement.addEventListener('click', () => {
        if (card instanceof PasseSonTour) {
          card.power(tour);
          tour = (tour + 1) % numberOfPlayers;
          updateTurnDisplay();
          displayPlayerCards();
        } else {
          card.power(deck.cards);
        }
      });

      cardContainer.appendChild(cardElement);
    });

    app.appendChild(cardContainer);
  }
}

nextButton?.addEventListener('click', () => {
  console.log('Tour : ', tour);

  if (deck.cards.length > 0) {
    const currentPlayerDeck = playerDecks[tour];
    const drawnCard = deck.cards.pop();
    currentPlayerDeck.cards.push(drawnCard as Card);

    checkPlayerDeck(tour + 1);
    tour = (tour + 1) % numberOfPlayers;

    updateTurnDisplay();
    displayPlayerCards();

    console.log('Deck principal après le tour : ', deck.cards);
  } else {
    console.log('Le deck est vide. Le jeu est terminé.');
  }
});

specialButton?.addEventListener('click', () => {
  displayPlayerCards();
});

export { main };
