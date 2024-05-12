const nextButton = document.getElementById('nextButton');
const specialButton = document.getElementById('specialButton');

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

export class PlayerDeck {
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


let tour = 0;
const numberOfPlayers = 4;

nextButton?.addEventListener('click', () => {
  console.log('Tour : ', tour);

  if (deck.cards.length > 0) {
    const currentPlayerDeck = playerDecks[tour];
    const drawnCard = deck.cards.pop();
    currentPlayerDeck.cards.push(drawnCard as Card);

    checkPlayerDeck(tour + 1);
    tour = (tour + 1) % numberOfPlayers;

    console.log('Deck principal après le tour : ', deck.cards);
  } else {
    console.log('Le deck est vide. Le jeu est terminé.');
  }
});

specialButton?.addEventListener('click', () => {
  console.log('Le joueur utilise une carte spéciale.');
});


export { main };

