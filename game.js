class MonopolyGame {
    constructor() {
        this.players = [
            { id: 1, name: 'Player 1', money: 1500, position: 0, color: '#ff0000' },
            { id: 2, name: 'Player 2', money: 1500, position: 0, color: '#0000ff' }
        ];
        this.currentPlayerIndex = 0;
        this.properties = this.initializeProperties();
        this.initializeBoard();
        this.setupEventListeners();
    }

    initializeProperties() {
        return [
            { name: 'GO', type: 'special', position: 0 },
            { name: 'Mediterranean Avenue', type: 'property', position: 1, price: 60, rent: 2, color: '#8B4513', owner: null },
            { name: 'Community Chest', type: 'chest', position: 2 },
            { name: 'Baltic Avenue', type: 'property', position: 3, price: 60, rent: 4, color: '#8B4513', owner: null },
            { name: 'Income Tax', type: 'tax', position: 4, amount: 200 },
            { name: 'Reading Railroad', type: 'railroad', position: 5, price: 200, rent: 25, owner: null },
            { name: 'Oriental Avenue', type: 'property', position: 6, price: 100, rent: 6, color: '#87CEEB', owner: null },
            { name: 'Chance', type: 'chance', position: 7 },
            { name: 'Vermont Avenue', type: 'property', position: 8, price: 100, rent: 6, color: '#87CEEB', owner: null },
            { name: 'Connecticut Avenue', type: 'property', position: 9, price: 120, rent: 8, color: '#87CEEB', owner: null },
            // Add more properties as needed
        ];
    }

    initializeBoard() {
        const boardGrid = document.querySelector('.board-grid');
        this.properties.forEach(property => {
            const square = document.createElement('div');
            square.className = 'square';
            if (property.type === 'property') {
                square.classList.add('property');
                const colorBar = document.createElement('div');
                colorBar.className = 'property-color';
                colorBar.style.backgroundColor = property.color;
                square.appendChild(colorBar);
            }
            square.innerHTML += `<div>${property.name}</div>`;
            if (property.price) {
                square.innerHTML += `<div>$${property.price}</div>`;
            }
            square.dataset.position = property.position;
            boardGrid.appendChild(square);
        });

        this.updatePlayersList();
    }

    setupEventListeners() {
        document.getElementById('roll-dice').addEventListener('click', () => this.rollDice());
        document.getElementById('end-turn').addEventListener('click', () => this.endTurn());
        document.getElementById('buy-property').addEventListener('click', () => this.buyProperty());
        document.getElementById('close-modal').addEventListener('click', () => this.closePropertyModal());
    }

    rollDice() {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const total = dice1 + dice2;
        
        document.getElementById('dice-result').textContent = `Dice: ${dice1} + ${dice2} = ${total}`;
        
        const currentPlayer = this.players[this.currentPlayerIndex];
        const newPosition = (currentPlayer.position + total) % this.properties.length;
        this.movePlayer(currentPlayer, newPosition);
        
        const property = this.properties[newPosition];
        if (property.type === 'property' && !property.owner) {
            document.getElementById('buy-property').disabled = false;
        }
    }

    movePlayer(player, newPosition) {
        player.position = newPosition;
        this.updatePlayerPosition(player);
        
        const property = this.properties[newPosition];
        if (property.type === 'property' && property.owner && property.owner !== player) {
            this.payRent(player, property);
        }
    }

    updatePlayerPosition(player) {
        const token = document.querySelector(`.player-token[data-player="${player.id}"]`) || this.createPlayerToken(player);
        const square = document.querySelector(`.square[data-position="${player.position}"]`);
        const squareRect = square.getBoundingClientRect();
        token.style.left = `${squareRect.left + squareRect.width/2 - 10}px`;
        token.style.top = `${squareRect.top + squareRect.height/2 - 10}px`;
    }

    createPlayerToken(player) {
        const token = document.createElement('div');
        token.className = 'player-token';
        token.dataset.player = player.id;
        token.style.backgroundColor = player.color;
        document.querySelector('.board').appendChild(token);
        return token;
    }

    payRent(player, property) {
        const rent = property.rent;
        player.money -= rent;
        property.owner.money += rent;
        this.updatePlayersList();
    }

    buyProperty() {
        const currentPlayer = this.players[this.currentPlayerIndex];
        const property = this.properties[currentPlayer.position];
        
        if (property.type === 'property' && !property.owner && currentPlayer.money >= property.price) {
            currentPlayer.money -= property.price;
            property.owner = currentPlayer;
            document.getElementById('buy-property').disabled = true;
            this.updatePlayersList();
        }
    }

    endTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        document.getElementById('current-player').textContent = `Current Player: ${this.players[this.currentPlayerIndex].name}`;
        document.getElementById('buy-property').disabled = true;
        document.getElementById('dice-result').textContent = '';
    }

    updatePlayersList() {
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = '';
        this.players.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player';
            playerDiv.innerHTML = `
                <div>${player.name}</div>
                <div>Money: $${player.money}</div>
                <div>Position: ${this.properties[player.position].name}</div>
            `;
            playersList.appendChild(playerDiv);
        });
    }

    closePropertyModal() {
        document.getElementById('property-modal').style.display = 'none';
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    const game = new MonopolyGame();
});
