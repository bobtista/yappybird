# Yelly Bird

Yelly Bird is a fun twist on the classic Flappy Bird game, where you control the bird's flight using your voice! Yell or make noise to make the bird fly higher.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (which comes with [npm](http://npmjs.com/))
- [pnpm](https://pnpm.io/) (A fast, disk space efficient package manager)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/bobtista/yelly-bird.git
   cd yelly-bird
   ```

2. Install the dependencies:
   ```
   pnpm install
   ```

## Running the Game

1. Start the development server:
   ```
   pnpm start
   ```

2. Open your web browser and navigate to `http://localhost:8080`

3. Click the "Start Game" button and allow microphone access when prompted.

4. Yell or make noise to make the bird fly! The louder the noise, the higher the bird will fly.

## How to Play

- The game starts when you click the "Start Game" button.
- Make noise into your microphone to make the bird fly upwards.
- Navigate the bird through the gaps in the pipes.
- Each successfully passed pipe earns you a point.
- The game ends if the bird collides with a pipe or the ground.
- Try to achieve the highest score possible!

## Troubleshooting

- If you're having trouble with microphone input, make sure your browser has permission to access your microphone.
- If the game is too sensitive to background noise, try adjusting the `threshold` and `noiseGate` values in the `processAudio` function in `game.js`.

## License

This project is open source and available under the [MIT License](LICENSE).

Enjoy playing Yelly Bird!