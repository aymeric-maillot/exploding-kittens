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

class Card {
  name: string;
  description: string;
  action: string;

  constructor(name: string, description: string, action: string) {
    this.name = name;
    this.description = description;
    this.action = action;
  }
}

class Desamorchage extends Card {
  constructor() {
    super('Desamorchage', 'Neutralise une Bombe.', 'Neutralize');
  }
}

class Bombe extends Card {
  constructor() {
    super('Bombe', 'Vous explosez si vous piochez cette carte sans désamorçage.', 'Explode');
  }
}

class Attaque extends Card {
  constructor() {
    super('Attaque', 'Attaque un adversaire.', 'Attack');
  }
}

class Non extends Card {
  constructor() {
    super('Non', 'Annulez une action ou une attaque d’un adversaire.', 'Cancel');
  }
}

class Melanger extends Card {
  constructor() {
    super('Melanger', 'Mélangez le deck.', 'Shuffle');
  }
}

class Divination extends Card {
  constructor() {
    super('Divination', 'Regardez les trois prochaines cartes du deck.', 'Foresee');
  }
}

class Paire extends Card {
  constructor(name: string, description: string) {
    super(name, description, 'Steal');
  }
}

class Faveur extends Card {
  constructor() {
    super('Faveur', 'Piochez deux cartes.', 'Draw');
  }
}

class PasseSonTour extends Card {
  constructor() {
    super('PasseSonTour', 'Passez votre tour.', 'Skip');
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

    deck.push(...this.createMultipleCards(CardType.desamorchage, 6));
    deck.push(...this.createMultipleCards(CardType.bombe, 4));
    deck.push(...this.createMultipleCards(CardType.attaque, 8));
    deck.push(...this.createMultipleCards(CardType.non, 5));
    deck.push(...this.createMultipleCards(CardType.melanger, 2));
    deck.push(...this.createMultipleCards(CardType.divination, 3));
    deck.push(...this.createMultipleCards(CardType.paire, 5));
    deck.push(...this.createMultipleCards(CardType.faveur, 7));
    deck.push(...this.createMultipleCards(CardType.passeSonTour, 4));

    const additionalCardsCount = 50 - deck.length;
    deck.push(...this.createMultipleCards(CardType.attaque, additionalCardsCount));

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


export class PlayerDeck {
  cards: Card[];

  constructor() {
    this.cards = this.buildPlayerDeck();
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


function displayDeck(deck: Deck) {
  console.log('Deck principal : ', deck.cards);
}

// Création du deck principal
function main() {
  // Création du deck principal
  const deck = new Deck();

  // Création des decks pour 5 joueurs
  const playerDecks: PlayerDeck[] = [];
  for (let i = 0; i < 5; i++) {
    const playerDeck = new PlayerDeck();
    playerDecks.push(playerDeck);
  }

  // Retirer les cartes des joueurs du deck principal
  playerDecks.forEach(playerDeck => {
    deck.removeCardsFromDeck(playerDeck.cards);
  });

  // Affichage des decks des joueurs
  console.log('Decks des joueurs : ');
  playerDecks.forEach((playerDeck, index) => {
    console.log(`Joueur ${index + 1} : `, playerDeck.cards);
  });

  // Affichage du contenu du deck principal
  displayDeck(deck);
}


export { Deck, displayDeck, main };

