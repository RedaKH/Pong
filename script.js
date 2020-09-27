const canvas = document.getElementById("pong");

const ctx = canvas.getContext('2d');




const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}


const user = {
    x : 0, 
    y : (canvas.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}


const com = {
    x : canvas.width - 10, 
    y : (canvas.height - 100)/2, 
    width : 10,
    height : 100,
    score : 0,
    color : "WHITE"
}

const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}


function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}


function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// controle de la souris
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// quand quelqu'un chope le score on redemarre le jeu
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}


function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// ecrit le texte
function drawText(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// collision detecté
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// cette fonction fait les calculs
function update(){
    //incrementation du score
    
    if( ball.x - ball.radius < 0 ){
        com.score++;
        comScore.play();
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    
    // l'ordinateur joue
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    
    
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    //Collision de la balle sur le joueur

    if(collision(ball,player)){
        let collidePoint = (ball.y - (player.y + player.height/2));
        
        collidePoint = collidePoint / (player.height/2);
        
        
        let angleRad = (Math.PI/4) * collidePoint;
        
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // augmenter la vitesse
        ball.speed += 0.1;
    }
}

// il fait tout le dessin
function render(){
    
    // efface le canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");
    
  
    drawText(user.score,canvas.width/4,canvas.height/5);
    
    
    drawText(com.score,3*canvas.width/4,canvas.height/5);
    
    // draw the net
    drawNet();
    
    // dessine la raquette du joueur
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // dessine la raquette de l'ordinateur
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // dessine la balle
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
    update();
    render();
}

let framePerSecond = 50;


let loop = setInterval(game,1000/framePerSecond);