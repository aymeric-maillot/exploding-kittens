enum CardType {
  Desamorçage = 'Desamorçage',
  Bombe = 'Bombe',
  Non = 'Non',
  Mélanger = 'Mélanger',
  Divination = 'Divination',
  Paire = 'Paire',
  Faveur = 'Faveur',
  Attaque = 'Attaque',
  PasseSonTour = 'PasseSonTour'
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

class Desamorçage extends Card {
  constructor() {
    super('Desamorçage', 'Neutralise une Bombe.', 'Neutralize');
  }
}

class Bombe extends Card {
  constructor() {
    super('Bombe', 'Vous explosez si vous piochez cette carte sans désamorçage.', 'Explode');
  }
}

class Non extends Card {
  constructor() {
    super('Non', 'Annulez une action ou une attaque d’un adversaire.', 'Cancel');
  }
}

class Mélanger extends Card {
  constructor() {
    super('Mélanger', 'Mélangez le deck.', 'Shuffle');
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
    super('Faveur', 'Demandez une carte à un autre joueur.', 'Request');
  }
}

class Attaque extends Card {
  constructor() {
    super('Attaque', 'Forcez le prochain joueur à prendre deux tours.', 'Force Double Turn');
  }
}

class PasseSonTour extends Card {
  constructor() {
    super('Passe Son Tour', 'Le joueur suivant saute son tour.', 'Skip');
  }
}

class CardFactory {
  static createCard(type: CardType, name?: string, description?: string): Card {
    switch (type) {
      case CardType.Desamorçage:
        return new Desamorçage();
      case CardType.Bombe:
        return new Bombe();
      case CardType.Non:
        return new Non();
      case CardType.Mélanger:
        return new Mélanger();
      case CardType.Divination:
        return new Divination();
      case CardType.Paire:
        return new Paire(name || 'Paire', description || 'Vol d\'une carte au choix.');
      case CardType.Faveur:
        return new Faveur();
      case CardType.Attaque:
        return new Attaque();
      case CardType.PasseSonTour:
        return new PasseSonTour();
      default:
        throw new Error('Unknown card type');
    }
  }
}

class Player {
  id: number;
  name: string;
  hand: Card[];

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.hand = [];
  }

  // drawCard(deck: Card[]): void {
  //   this.hand.push(deck.pop());
  // }

  playCard(cardIndex: number): Card | undefined {
    return this.hand.splice(cardIndex, 1)[0];
  }
}

class GameManager {
  players: Player[];
  deck: Card[];

  constructor(playerNames: string[], deck: Card[]) {
    this.deck = deck;
    this.players = playerNames.map((name, index) => new Player(index, name));
    this.dealInitialCards();
  }

  dealInitialCards(): void {
    this.deck.forEach((card, index) => {
      if (card instanceof Desamorçage) {
        const player = this.players[index % this.players.length];
        player.hand.push(card);
      }
    });

    this.deck = this.deck.filter(card => !(card instanceof Desamorçage));

    this.players.forEach(player => {
      while (player.hand.length < 7) {
        let card = this.deck.pop();
        if (card && !(card instanceof Bombe)) {
          player.hand.push(card);
        } else {
          this.deck.unshift(card as any);  // Put Bombe back to deck to shuffle later
        }
      }
    });

    shuffle(this.deck);  // Shuffle after setup
  }

  getNextPlayer(currentPlayerId: number): Player {
    return this.players[(currentPlayerId + 1) % this.players.length];
  }

  playTurn(playerId: number, cardIndex: number): void {
    const player = this.players[playerId];
    // @ts-ignore
    const cardPlayed = player.playCard(cardIndex);
    // Add game logic here based on the card played
  }
}

function generateDeck(): Card[] {
  const types = [CardType.Desamorçage, CardType.Bombe, CardType.Non, CardType.Mélanger, CardType.Divination, CardType.Paire, CardType.Faveur, CardType.Attaque, CardType.PasseSonTour];
  let deck: any[] = [];
  types.forEach(type => {
    for (let i = 0; i < 5; i++) { // Adjust quantity as needed
      deck.push(CardFactory.createCard(type));
    }
  });
  return shuffle(deck);
}

function shuffle(deck: Card[]): Card[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const playerNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
const initialDeck = generateDeck();
const gameManager = new GameManager(playerNames, initialDeck);

function renderCards() {
  // Rendering logic for displaying cards
  const currentPlayerId = 0;
  const currentPlayer = gameManager.players[currentPlayerId];
  currentPlayer.hand.forEach((card, index) => {
    console.log(`[${index}] ${card.name}: ${card.description}`);
  });
}

function displayGameSetup() {
  const gameArea = document.getElementById('gameArea'); // Ensure there's a div with id="gameArea" in your HTML
  gameArea.innerHTML = ''; // Clear existing content

  // Display each player's hand
  gameManager.players.forEach((player, index) => {
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.innerHTML = `<h2>Player ${index + 1}: ${player.name}</h2><div class="hand"></div>`;

    const handDiv = playerDiv.querySelector('.hand');
    player.hand.forEach(card => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'card';
      cardDiv.innerHTML = `
                <h3>${card.name}</h3>
                <p>${card.description}</p>
                <small>Action: ${card.action}</small>
            `;
      handDiv.appendChild(cardDiv);
    });

    gameArea.appendChild(playerDiv);
  });

  // Display the main deck
  const mainDeckDiv = document.createElement('div');
  mainDeckDiv.className = 'player'; // Using the same style
  mainDeckDiv.innerHTML = `<h2>Main Deck</h2><div class="hand"></div>`;

  const mainHandDiv = mainDeckDiv.querySelector('.hand');
  gameManager.deck.forEach(card => {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.innerHTML = `
            <h3>${card.name}</h3>
            <p>${card.description}</p>
            <small>Action: ${card.action}</small>
        `;
    mainHandDiv.appendChild(cardDiv);
  });

  gameArea.appendChild(mainDeckDiv);
}

// Call this function to update the display when the page loads or when necessary

export { displayGameSetup };
