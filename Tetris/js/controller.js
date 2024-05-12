document.body.onkeydown = function (e) {
    var keys = { //Клавиши
     37: 'left',
     39: 'right', 
     40: 'down',
     32: 'down', 
     38: 'rotate', 
     27: 'escape' 
    };
    if (typeof(keys[e.keyCode])!='undefined') { //Если код клавиши допустимый,
     keyPress (keys[e.keyCode]); //Передать его обработчику
     render(); //и перерисовать 
    }
   };