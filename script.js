const gameContainer = document.querySelector(".game-container");
const pointCounter = document.querySelector(".pointCounter");
const bird = document.querySelector(".bird");
const containerGameOver = document.querySelector(".container-gameOver");
const scoreNumbers = document.querySelector('.scoreNumbers');
const btnRestart = document.querySelector('.btn-restart');

let birdProps = {
  left: window.innerWidth <= 700 ? 80 : 150,
  bottom: 276,
  img: {
    initial: "./img/bird-initial.png",
    up: "./img/bird-up-flap.png",
    down: "./img/bird-down-flap.png",
  },
};

let isGameOver = false;

let counter = 0;

bird.style.left = `${birdProps.left}px`;
pointCounter.innerHTML = counter;

window.addEventListener('resize', () => {
  if(birdProps.left !== 150){
    birdProps.left = 150;
    bird.style.left = `${birdProps.left}px`;
  }
  if(window.innerWidth <= 700 && birdProps.left !== 80){
    birdProps.left = 80;
    bird.style.left = `${birdProps.left}px`;
    return;
  }
})

const createGravity = () => {
  if (birdProps.bottom && !isGameOver) {
    birdProps.bottom -= 2;
    bird.style.bottom = `${birdProps.bottom}px`;
  } else {
    gameOver();
  }
};

let gravityBird = setInterval(createGravity, 20);

const jump = () => {
  //altura limite
  if (birdProps.bottom < 480 && !isGameOver) {
    bird.style.backgroundImage = `url(${birdProps.img.up})`;
    setTimeout(() => {
      bird.style.backgroundImage = `url(${birdProps.img.down})`;
    }, 120);
    birdProps.bottom += 30;
  }
};

gameContainer.addEventListener("click", jump);

const createObstacles = () => {
  let obstacleBottomProps = {
    left: 700,
    height: Math.floor(Math.random() * (420 - 150) + 150),
  };

  let obstacleTopProps = {
    left: 700,
    height: 450 - obstacleBottomProps.height,
  };

  const obstacleBottom = createPipeElement(
    "obstacleBottom",
    obstacleBottomProps.left,
    obstacleBottomProps.height
  );
  gameContainer.appendChild(obstacleBottom);

  const obstacleTop = createPipeElement(
    "obstacleTop",
    obstacleTopProps.left,
    obstacleTopProps.height
  );
  gameContainer.appendChild(obstacleTop);

  //obtener estilos del obstacleTop, especificamente la propiedad 'bottom', y como devuelve con 'px', se corta con slice esos 2 ultimos caracteres
  obstacleTopProps.bottom = window
    .getComputedStyle(obstacleTop)
    .getPropertyValue("bottom")
    .slice(0, -2);

  const move = () => {
    obstacleBottomProps.left -= 2;
    obstacleBottom.style.left = `${obstacleBottomProps.left}px`;

    obstacleTopProps.left -= 2;
    obstacleTop.style.left = `${obstacleTopProps.left}px`;

    if (isGameOver) clearInterval(moveObstacle);

    if (obstacleBottomProps.left === -80) {
      gameContainer.removeChild(obstacleBottom);
      clearInterval(moveObstacle);
    }

    if (
      obstacleBottomProps.left < birdProps.left &&
      obstacleBottomProps.left >= birdProps.left - 2
    ) {
      counter += 1;
      pointCounter.innerHTML = counter;
    }

    if (
      (birdProps.bottom <= obstacleBottomProps.height &&
        obstacleBottomProps.left <= birdProps.left + 80 && //+80 y -80 porque 80px tiene de ancho el bird
        obstacleBottomProps.left > birdProps.left - 80) ||
      (birdProps.bottom >= obstacleTopProps.bottom - 55 && //-55 porque 55px tiene de altura el bird
        obstacleTopProps.left <= birdProps.left + 80 &&
        obstacleTopProps.left > birdProps.left - 80)
    ) {
      gameOver();
      clearInterval(moveObstacle);
    }
  };

  let moveObstacle = setInterval(move, 20);
};

const createPipeElement = (className, left, height) => {
  const element = document.createElement("div");
  element.classList.add(className);
  element.style.left = `${left}px`;
  element.style.height = `${height}px`;
  return element;
};

createObstacles();

const obstacleInterval = setInterval(createObstacles, 2800);

const gameOver = () => {
  const score = counter;
  scoreNumbers.innerHTML = score;
  isGameOver = true;
  clearInterval(gravityBird);
  clearInterval(obstacleInterval);
  document.removeEventListener("click", gameContainer);

  containerGameOver.style.display = "flex";
};

btnRestart.addEventListener('click', () => {
  window.location.reload();
});