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

abstract class Card {
  name: string;
  description: string;
  action: string;

  constructor(name: string, description: string, action: string) {
    this.name = name;
    this.description = description;
    this.action = action;
  }

  abstract power(): void;
}

class Desamorchage extends Card {
  constructor() {
    super('Desamorchage', 'Neutralise une Bombe.', 'Neutralize');
  }

  power() {
    console.log('Pouvoir de la carte Desamorchage : Neutralise une Bombe.');
  }
}

class Bombe extends Card {
  constructor() {
    super('Bombe', 'Vous explosez si vous piochez cette carte sans désamorçage.', 'Explode');
  }

  power() {
    console.log('Pouvoir de la carte Bombe : Vous explosez si vous piochez cette carte sans désamorçage.');
  }
}

class Attaque extends Card {
  constructor() {
    super('Attaque', 'Attaque un adversaire.', 'Attack');
  }

  power() {
    console.log('Pouvoir de la carte Attaque : Attaque un adversaire.');
  }
}

class Non extends Card {
  constructor() {
    super('Non', 'Annulez une action ou une attaque d’un adversaire.', 'Cancel');
  }

  power() {
    console.log('Pouvoir de la carte Non : Annulez une action ou une attaque d’un adversaire.');
  }
}

class Melanger extends Card {
  constructor() {
    super('Melanger', 'Mélangez le deck.', 'Shuffle');
  }

  power() {
    console.log('Pouvoir de la carte Melanger : Mélangez le deck.');
  }
}

class Divination extends Card {
  constructor() {
    super('Divination', 'Regardez les trois prochaines cartes du deck.', 'Foresee');
  }

  power() {
    console.log('Pouvoir de la carte Divination : Regardez les trois prochaines cartes du deck.');
  }
}

class Paire extends Card {
  constructor(name: string, description: string) {
    super(name, description, 'Steal');
  }

  power() {
    console.log('Pouvoir de la carte Paire : Echangez votre main avec celle d’un adversaire.');
  }
}

class Faveur extends Card {
  constructor() {
    super('Faveur', 'Piochez deux cartes.', 'Draw');
  }

  power() {
    console.log('Pouvoir de la carte Faveur : Piochez deux cartes.');
  }
}

class PasseSonTour extends Card {
  constructor() {
    super('PasseSonTour', 'Passez votre tour.', 'Skip');
  }

  power() {
    console.log('Pouvoir de la carte PasseSonTour : Passez votre tour.');
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

  removeCardsFromDeck(cards: Card[]) {
    for (const card of cards) {
      const index = this.cards.findIndex(c => c.name === card.name && c.description === card.description && c.action === card.action);
      if (index !== -1) {
        this.cards.splice(index, 1);
      }
    }
  }

  private buildDeck(): Card[] {
    const deck: Card[] = [];

    // Construire le deck en fonction du nombre de cartes de chaque type
    deck.push(...this.createMultipleCards(CardType.desamorchage, 6));
    deck.push(...this.createMultipleCards(CardType.bombe, 4));
    deck.push(...this.createMultipleCards(CardType.attaque, 8));
    deck.push(...this.createMultipleCards(CardType.non, 5));
    deck.push(...this.createMultipleCards(CardType.melanger, 2));
    deck.push(...this.createMultipleCards(CardType.divination, 3));
    deck.push(...this.createMultipleCards(CardType.paire, 5));
    deck.push(...this.createMultipleCards(CardType.faveur, 7));
    deck.push(...this.createMultipleCards(CardType.passeSonTour, 4));

    this.shuffle(deck);

    const totalPlayerCards = playerDecks.reduce((acc, playerDeck) => acc + playerDeck.cards.length, 0);

    const remainingCardsCount = 50 - totalPlayerCards;

    if (remainingCardsCount < 0) {
      console.log('Erreur: Le nombre total de cartes distribuées aux joueurs dépasse le nombre total de cartes dans le deck.');
      return [];
    }

    return deck.slice(0, remainingCardsCount);
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

export class PlayerDeck {
  cards: Card[];

  constructor() {
    this.cards = this.buildPlayerDeck();
  }

  drawCard(deck: Deck) {
    if (deck.cards.length > 0) {
      const drawnCard = deck.cards.shift(); // Prendre la première carte du deck
      if (drawnCard) {
        this.cards.push(drawnCard); // Ajouter la carte piochée au deck du joueur
        console.log(`Le joueur a pioché une carte : ${drawnCard.name}`);
      }
    } else {
      console.log('Le deck est vide. Impossible de piocher une carte.');
    }
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

let currentPlayerIndex = 0; // Indice du joueur actuel
const playerDecks: PlayerDeck[] = []; // Tableau des decks des joueurs

// Fonction pour passer au joueur suivant
function nextPlayer(deck: Deck) {
  currentPlayerIndex++; // Passer au joueur suivant
  if (currentPlayerIndex >= playerDecks.length) {
    currentPlayerIndex = 0; // Revenir au premier joueur si on a atteint le dernier joueur
  }
  const currentPlayerDeck = playerDecks[currentPlayerIndex];
  currentPlayerDeck.drawCard(deck); // Le joueur suivant pioche une carte
  displayCurrentGameState(deck); // Afficher l'état actuel du jeu
}

// Fonction pour afficher l'état actuel du jeu
function displayCurrentGameState(deck: Deck) {
  console.log('--- État actuel du jeu ---');
  console.log('Deck principal : ', deck.cards);
  playerDecks.forEach((playerDeck, index) => {
    console.log(`Joueur ${index + 1} : `, playerDeck.cards);
  });
}

function main() {
  // Création du deck principal
  const deck = new Deck();

  // Création des decks pour 5 joueurs
  for (let i = 0; i < 5; i++) {
    const playerDeck = new PlayerDeck();
    playerDecks.push(playerDeck);
  }

  // Afficher l'état initial du jeu
  displayCurrentGameState(deck);

  // Piocher une carte pour chaque joueur au début du jeu
  playerDecks.forEach(playerDeck => {
    playerDeck.drawCard(deck);
  });

  // Afficher l'état du jeu après que chaque joueur ait pioché une carte
  displayCurrentGameState(deck);

  // Modélisation du bouton "Next"
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => nextPlayer(deck));
  document.body.appendChild(nextButton);
}

export { Deck, main };
