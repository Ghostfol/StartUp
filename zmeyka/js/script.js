const canvas = document.querySelector('#game');

const mappingFoot = document.querySelector('.header__foot');
const mappingRecord = document.querySelector('.header__record');
const mappingAttemps = document.querySelector('.header__attemps');

if (canvas.getContext) {
    const ctx   = canvas.getContext('2d');

    let mapWidth        = canvas.width;
    let mapHeight       = canvas.height;
    let defaultSpeed    = 5;                 
    let speed           = 5;                 
    let interval        = 1000 / speed;      
    let then            = performance.now(); 

    function speedSnake(speed) {
        interval = 1000 / speed;        
    }
    
    let snake = {
        x:          mapWidth / 2,
        y:          mapHeight / 2,
        w:          32,
        h:          32,
        step:       32,
        moveX:      0,
        moveY:      0,
        fill:       '#56cefa',
        secFill:    '#2092bb',
        foot:       0,
        recordFoot: 0,
        body:       [],
        size:       3,
        defaultSize:3,
        attemps:    0,
        win:        300,
        activeKey:  true,
    }
    

    let foot = {
        x :         0,
        y :         0,
        fill:       '#fa5656',
    }

    localStor();
    function localStor() {
        if (localStorage.getItem('record')) {
            snake.recordFoot = localStorage.getItem('record');
            mappingRecord.innerHTML = snake.recordFoot;
            console.log(snake.recordFoot);
        } else {
            localStorage.setItem('record', snake.recordFoot)
        }
    }
    

    function animate(now) {
        requestAnimationFrame(animate);

        let delta = now - then; 
        if (delta > interval) {
            then = now - (delta % interval);
            ctx.clearRect(0, 0, mapWidth, mapHeight);

            drawSnake();
            drawFoot();
        }
    }

    document.addEventListener('keydown', control);
    function control(event) {
        animate(performance.now());
        e = event.keyCode;

        if (e === 37 && snake.moveX !== +snake.step && snake.activeKey === true) { snake.moveX = -snake.step;  snake.moveY = 0; snake.activeKey = false }
        if (e === 39 && snake.moveX !== -snake.step && snake.activeKey === true) { snake.moveX = +snake.step;  snake.moveY = 0; snake.activeKey = false }
        if (e === 38 && snake.moveY !== +snake.step && snake.activeKey === true) { snake.moveY = -snake.step;  snake.moveX = 0; snake.activeKey = false }
        if (e === 40 && snake.moveY !== -snake.step && snake.activeKey === true) { snake.moveY = +snake.step;  snake.moveX = 0; snake.activeKey = false }

        if (e === 32) restartGame();
    }
    
    drawSnake();
    function drawSnake() {
        ambit(); 
        
        ctx.fillStyle = snake.fill;
        ctx.fillRect(snake.x += snake.moveX, snake.y += snake.moveY, snake.w, snake.h);
        
        snake.body.unshift( { x: snake.x, y: snake.y } );
        if (snake.body.length > snake.size) { snake.body.splice( -(snake.body.length - snake.size)) } 

        if (snake.body[0].x === foot.x && snake.body[0].y === foot.y) {
            snake.size++;
            snake.foot++;

            upComplexitySnake();    
            refreshMeppingFoot();   
            refreshRecordFoot();    
            positionFoot();         
        }

        snake.activeKey = true;     

        snake.body.forEach( function(el, index) {
            crachedIntoTheTail(el, index);

            if (index === snake.win) youWin();

            if (index === 0) {
                ctx.fillStyle = snake.fill
            } else {
                ctx.fillStyle = snake.secFill
            }
            ctx.fillRect(el.x, el.y, snake.step, snake.step)
        })
    }

    function crachedIntoTheTail(el, index) { 
        if (snake.body.length > snake.defaultSize && snake.body[0].x === el.x && snake.body[0].y === el.y && index !== 0) restartGame();
    }

    function youWin() {
        alert(`Поздравляю ты победил, твоя змея длинной ${snake.win}см. Неплохо :)`)
        restartGame();
    }

    function ambit() {
        if (snake.x + snake.moveX >= mapWidth) snake.x = -snake.step
        if (snake.x + snake.moveX < 0) snake.x = mapWidth
        if (snake.y + snake.moveY >= mapHeight) snake.y = -snake.step
        if (snake.y + snake.moveY < 0) snake.y = mapHeight
    }

    function drawFoot() {
        ctx.fillStyle = foot.fill;
        ctx.fillRect(foot.x, foot.y, snake.w, snake.h);
    }

    function positionFoot() {
        let x = randomX();
        let y = randomY();
        let overlapping = false;
    
        snake.body.forEach(function(el) {
            if (el.x === x && el.y === y) {
                overlapping = true;
            }
        });
    
        if (overlapping) {
            positionFoot(); 
        } else {
            foot.x = x;
            foot.y = y;
        }
    }    

    function randomX() { 
        return Math.floor(Math.random() * (mapWidth / snake.step)) * snake.step;
    }

    function randomY() { 
        return Math.floor(Math.random() * (mapHeight / snake.step)) * snake.step;
    }

    function upComplexitySnake() {
        speedSnake(defaultSpeed + (snake.foot / 20))
    }

    function refreshMeppingFoot() {
        mappingFoot.innerHTML = snake.foot;
    }

    function refreshRecordFoot() {
        if (snake.recordFoot < snake.foot) {
            snake.recordFoot = snake.foot;
            mappingRecord.innerHTML = snake.recordFoot;
            localStorage.setItem('record', snake.recordFoot);
        }
        mappingFoot.innerHTML = snake.foot;
    }

    function refreshAttempsFoot() {
        if (snake.attemps < 100) snake.attemps++;
        else snake.attemps = 0;
        mappingAttemps.innerHTML = snake.attemps;
    }

    function restartGame() {
        snake.size = snake.defaultSize;
        snake.foot = 0;
        refreshMeppingFoot();
        speedSnake(defaultSpeed);
        refreshAttempsFoot();
    }
}