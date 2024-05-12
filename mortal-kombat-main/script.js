import { Game } from "./game.js"; // Для начала новой игры 

async function startNewGame() {
  const game = new Game();
  await game.init();
  document.querySelector('.loading').style.display = 'none'; // Переход из режима загрузки в игру
}

startNewGame();