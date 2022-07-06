//unit 
let box = 35;
let score = 0;
let width_grid = 13 ;
let off = 0;
let time_interval_calling_function = 100;// in ms

var canvas = document.createElement('canvas');

canvas.id = "snake";
canvas.width = width_grid * box;
canvas.height = width_grid * box;

let food_pos = {
    x: 4 * box ,
    y: 4 * box
}

let snake = [];
snake[0] = {
    x : box + off,
    y : box
}

let d = "right" ;
let dir_set = false;
let click_on_back = false;
let game_start = false;
let count = 0;
let speed = (box * 1000)/time_interval_calling_function;
let found_dir = false;
let strategy = "BFS";
let dirs = ["left", "right", "down", "up"];
let Found_dirs = [];
var calling_btn;
const food = new Image();
food.src = "img/food.jpg" ; 

let food_audio = new Audio();
let hitting_wall = new Audio();
let crawling = new Audio();
let game_over = new Audio();
let click_sound = new Audio();

let background = document.getElementsByClassName("background")[0];
let score_card = document.getElementById("score");
let score_box = document.getElementById("score_box");
let speed_card = document.getElementById("speed");
let speed_box = document.getElementById("speed_box");
let game_over_card = document.getElementById("game_over");
let fin_score = document.getElementById("game_over_score");
let main_page = document.getElementsByClassName("home_page");
let main_page_list = document.getElementsByClassName("list_options");
let main_page_game_btn = document.getElementsByClassName("options--1");
let main_page_demo_btn = document.getElementsByClassName("options--2")[0];
let main_page_help_btn = document.getElementsByClassName("options--3")[0];
let back_btn = document.getElementsByClassName("btn_back")[0];
let reset_btn = document.getElementsByClassName("btn_reset")[0];
let count_box = document.getElementById("count");
let submit_level = document.getElementById("submit_level");
let submit_strategy = document.getElementById("submit_strategy");
let div_choose_level = document.getElementsByClassName("choose_level")[0];
let div_choose_strategy = document.getElementsByClassName("choose_strategy")[0];
let help = document.getElementsByClassName("help")[0];

var key;//level
let no_of_blocks = (width_grid * width_grid)/10;
let sites_of_blocks = new Array(width_grid);
let count_i;
for(let x = 0 ; x < width_grid; x ++)
{
    sites_of_blocks[x] = new Array(width_grid);
    for(let y = 0; y < width_grid ; y ++)
    {
        sites_of_blocks[x][y] = 0;
    }
}
score_box.insertAdjacentElement('afterend',canvas);

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

let game = setInterval(draw,time_interval_calling_function);

const style_reset_btn = {
    visibility : "visible",
    opacity : "1",
    top : "50%",
    transform: "translate(-50%,0%)"
}
const style_reset_btn_st = {
    visibility : "hidden",
    opacity : "0",
    top : "90%"
}

const canvas_game_over = {
    filter : "blur(3px) brightness(50%)"
}

const style_game_over = {
    top: "40%",
    visibility: "visible",
    opacity : "1",
    transform: "translate(-50%,-50%)"
}
const style_game_over_st = {
    top: "0%",
    visibility: "hidden",
    opacity : "0"
}

const style_turning_page = {
    transform: "translate(-50%,-50%) rotateY(-180deg)",
    opacity: "0"
}

const reset_turning = {
    transform: "translate(-50%,-50%) rotateY(0deg)",
    opacity: "1"
}
clearInterval(game);

food_audio.src = "audio/eating_food.wav";
hitting_wall.src = "audio/hitting_wall.wav";
game_over.src = "audio/game_over.wav";
crawling.src = "audio/crawling.wav";
click_sound.src = "audio/click.wav";

back_btn.addEventListener("click",reload);
main_page_game_btn[0].addEventListener("click",init);
main_page_demo_btn.addEventListener("click",init);
reset_btn.addEventListener("click",init);
main_page_help_btn.addEventListener("click",show_help);

// screen.orientation.lock("portrait-primary");
// screen.msLockOrientation.lock("portrait-primary");
// screen.mozLockOrientation.lock("portrait-primary");
clicked();

swipedetect(background, function(swipedir){
    change_dir(swipedir);
})  
swipedetect(cvs, function(swipedir){
    change_dir(swipedir);
})  
function change_dir(swipedir){
    //swipedir contains either "none", "left", "right", "top", or "down"
    if((swipedir == "left") && (d != "right"))
    {
        d = "left";
    }
    else if((swipedir == "up")&& (d != "down"))
    {
        d = "up" ;
    }
    else if((swipedir == "right")&& (d != "left"))
    {
        d = "right" ;
    }
    else if((swipedir == "down")&& (d != "up"))
    {
        d = "down" ;
    }
}

function rev(d){
    if(d == "left")
        return "right";
    if(d == "right")
        return "left";
    if(d == "up")
        return "down";
    return "up";
}

function init(event) {
    game_start = true;
    if(event.currentTarget != reset_btn)
        calling_btn = event.currentTarget;
    background.style.filter = "none";
    fin_score.innerHTML = 0; 
    score = 0;
    Object.assign(main_page[0].style,style_turning_page);
    Object.assign(reset_btn.style,style_reset_btn_st);
    Object.assign(game_over_card.style,style_game_over_st);
    document.getElementsByClassName("game")[0].style.opacity = "1";
    document.getElementsByClassName("game")[0].style.display = "block";
    help.style.display = "none";
    Found_dirs = [];
    //sites_of_blocks initialiasation
    for(let x = 0 ; x < width_grid; x ++)
    {
        for(let y = 0; y < width_grid ; y ++)
        {
            sites_of_blocks[x][y] = 0;
        }
    }
    //selecting blocks randomly
    random_blocks();

    draw_canvas();
    let x = Math.floor(Math.random() * (width_grid - 3) + 2);
    let y = Math.floor(Math.random() * (width_grid - 3) + 2);
    while(sites_of_blocks[x][y] == 1)
    {
        x = Math.floor(Math.random() * (width_grid - 3) + 2);
        y = Math.floor(Math.random() * (width_grid - 3) + 2);
    } 
    food_pos.x = x * box;
    food_pos.y = y * box;
    div_choose_level.style.display = "block";
    submit_level.addEventListener("click",start);
    window.removeEventListener("keydown",control);
    click_on_back = false;
}

function start() {

    let form = document.getElementById("list_levels");
    for(i = 0; i < form.length ; i ++)
    {
        if(form.elements[i].checked == true)
            key = form.elements[i].value ;
    }
    switch (key) {
        case "Easy": time_interval_calling_function = 250;
                        break;
        case "Medium": time_interval_calling_function = 150;
                        break;
        case "Hard": time_interval_calling_function = 100;
                        break;
        default:
            break;
    }
    speed = Math.floor((box * 1000)/time_interval_calling_function);
    div_choose_level.style.display = "none";
    div_choose_strategy.style.display = "none";
    if(calling_btn == main_page_demo_btn){
        div_choose_strategy.style.display = "block";
        submit_strategy.addEventListener("click",Choose_strategy);
    }else{
        count = 3;
        count_i = setInterval(counting,1000);
    }
}

function Choose_strategy(){
    let form = document.getElementById("list_strategy");
    for(i = 0; i < form.length ; i ++)
    {
        if(form.elements[i].checked == true)
            strategy = form.elements[i].value ;
    }
    submit_strategy.removeEventListener("click",Choose_strategy);
    div_choose_strategy.style.display = "none";
    count = 3;
    count_i = setInterval(counting,1000);
}

function clicked() {

    let buttons = document.getElementsByTagName("button");

    for(i = 0; i < buttons.length; i ++){
        buttons[i].addEventListener("mousedown",f=>{
            click_sound.play();
        })
    }
}

function auxilary() {
    score_box.style.transform = "translate(0%,-100%)";
    speed_box.style.transform = "translate(0%,-100%)";
    back_btn.style.transform = "translate(-50%,-100%)";
    background.style.filter = "blur(3px) brightness(70%)";
    d = "right";
    let ori_len = snake.length;
    for(i = 1 ;i < ori_len; i ++)
        snake.pop();
    snake[0].x = 0;
    snake[0].y = 0 ;
    cvs.style.filter = "none";
    score = 0;
    score_card.innerHTML = score;
    speed_card.innerHTML = speed.toString() + " px/s";
    game = setInterval(draw,time_interval_calling_function);
}

function counting() {
    if(count > 0)
        count_box.innerHTML = count;
    else if(count == 0)
    {
        count_box.innerHTML = "Go";
    }    
    else{
        count_box.innerHTML = "";
        auxilary();
        clearInterval(count_i);
    }
    count --;
}

//control the snake
function control(event)
{
    if((event.keyCode == 37) && (d != "right"))
    {
        d = "left";
    }
    else if((event.keyCode == 38)&& (d != "down"))
    {
        d = "up" ;
    }
    else if((event.keyCode == 39)&& (d != "left"))
    {
        d = "right" ;
    }
    else if((event.keyCode == 40)&& (d != "up"))
    {
        d = "down" ;
    }
    window.removeEventListener("keydown",control);
}

function random_blocks(){
    let lim = 9, x = 0, y = 0;
    sites_of_blocks[2][2] = 1;
    for(i = 0;i < lim; i ++){
        let lim_dis = 2;
        while(1){
            x = Math.floor(Math.random()*(width_grid - 2) + 1);
            y = Math.floor(Math.random()*(width_grid - 2) + 1);
            let tk = false;
            for(x_ch = -lim_dis; x_ch <= lim_dis; x_ch ++){
                for(y_ch = -lim_dis; y_ch <= lim_dis; y_ch ++){
                    let nw_x = x + x_ch;
                    let nw_y = y + y_ch;
                    if((nw_x >= 0) && (nw_x < width_grid) && (nw_y >= 0) && (nw_y < width_grid)){
                        tk |= sites_of_blocks[nw_x][nw_y];
                    }                    
                }
            }
            if(!tk)
                break;
        }
        sites_of_blocks[x][y] = 1;
    }
}

function draw_canvas() {
    //grid
    for(let x = 0; x < width_grid  ; x ++)
    {
        for(let y = 0; y < width_grid ; y ++)
        {
            if(sites_of_blocks[x][y] == 1)
            {
                ctx.fillStyle = "rgb(255,0,255)";
            }
            else if(x % 2)
            {
                if(y % 2 )
                    ctx.fillStyle = "#00FF00";
                else
                    ctx.fillStyle = "#1b572b";
            }
            else
            {
                if(y % 2 )
                    ctx.fillStyle = "#1b572b";
                else
                    ctx.fillStyle = "#00FF00";
            }        
            ctx.fillRect(x * box + off,y * box,box,box);
        }
    }
}

function draw(){
    //grid
    draw_canvas();
    ctx.drawImage(food,food_pos.x,food_pos.y,box,box);
    //snake
    for(i = 0 ; i < snake.length; i++){
        ctx.fillStyle = ( i == 0) ? "red":"black" ;
        ctx.fillRect(snake[i].x,snake[i].y,box,box);

        ctx.strokeStyle = "white";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    if(calling_btn != main_page_demo_btn)
    {
        window.addEventListener("keydown",control) ;      
    }
    else
    {
        if(strategy == "BFS")
            Get_Dir_By_BFS();
        else
            req_dir();
    }
    let new_head = make_new_head(snake, d);
    if(check_game_over(new_head, snake) == true)
    {
        f_game_over();
        clearInterval(game);
    }
    //directions
    snake.unshift(new_head);
    crawling.play();

    if((snake[0].x == food_pos.x) && (snake[0].y == food_pos.y))
    {
        score ++;
        score_card.innerHTML = score;
        let x = food_pos.x / box, y = food_pos.y / box;
        let lim_dis = 1;
        while(1){
            x = Math.floor(Math.random()*(width_grid - 2) + 1);
            y = Math.floor(Math.random()*(width_grid - 2) + 1);
            let tk = false;
            for(x_ch = -lim_dis; x_ch <= lim_dis; x_ch ++){
                for(y_ch = -lim_dis; y_ch <= lim_dis; y_ch ++){
                    let nw_x = x + x_ch;
                    let nw_y = y + y_ch;
                    if((nw_x >= 0) && (nw_x < width_grid) && (nw_y >= 0) && (nw_y < width_grid)){
                        tk |= sites_of_blocks[nw_x][nw_y];
                    }                    
                    tk |= ((nw_x == snake[0].x) && (nw_y == snake[0].y));
                }
            }
            if(!tk)
                break;
        }
        food_pos.x = x * box;
        food_pos.y = y * box;
        found_dir = false;
        food_audio.play();
    }
    else
    {
        snake.pop();
    }
}

function make_new_head(snake, d) {
    let new_x = snake[0].x;
    let new_y = snake[0].y;
    if(d == "left") {new_x -= box;} ;
    if(d == "right") {new_x += box} ;
    if(d == "up") {new_y -= box} ;
    if(d == "down") {new_y += box} ;

    let new_head = {
        x : new_x ,
        y : new_y 
    }
    return new_head;
}

function make_new_snake(old_snake, d){
    let new_snake = [];
    for(i = 0; i < old_snake.length; i ++){
        new_snake[i] = {
                        x: old_snake[i].x, 
                        y: old_snake[i].y
                        }; 
    }
    new_snake.unshift(make_new_head(new_snake, d));
    new_snake.pop();
    return new_snake;
}

function DFS_Search(ps_snake, d, visited){
    if(check_game_over(ps_snake[0], ps_snake))
        return false;
    if((ps_snake[0].x == food_pos.x) && (ps_snake[0].y == food_pos.y))
        return true;
    if(visited[ps_snake[0].x/box][ps_snake[0].y/box])
        return false;
    let gt_r = false;
    visited[ps_snake[0].x/box][ps_snake[0].y/box] = 1;
    for(let i = 0; i < dirs.length; i ++){
        if(dirs[i] != rev(d)){
            let nw_sn = make_new_snake(ps_snake, dirs[i]);
            gt_r = DFS_Search(nw_sn, dirs[i], visited);
            if(gt_r)
                break;
        }
    }
    visited[ps_snake[0].x/box][ps_snake[0].y/box] = 0;
    return gt_r;
}

function Get_Dir_By_DFS(){
    let nw_d = d;
    let visited = new Array(width_grid);
    for(let x = 0 ; x < width_grid; x ++)
    {
        visited[x] = new Array(width_grid);
        for(let y = 0; y < width_grid ; y ++)
        {
            visited[x][y] = 0;
        }
    }
    let gt_r = false;
    for(let i = 0; i < dirs.length; i ++){
        if(dirs[i] != rev(d)){
            let nw_sn = make_new_snake(snake, dirs[i]);
            gt_r = DFS_Search(nw_sn, dirs[i], visited);
            if(gt_r)
                nw_d = dirs[i];
        }
    }
    d = nw_d;
}

function Get_Dir_By_BFS(){
    if(Found_dirs.length > 0){
        d = Found_dirs[Found_dirs.length - 1];
        Found_dirs.pop();
        return;
    }
    let nw_d = d;
    let visited = new Array(width_grid), par = new Array(width_grid), go_dirs = new Array(width_grid), que = [], prevDir = [];
    for(let x = 0 ; x < width_grid; x ++)
    {
        visited[x] = new Array(width_grid);
        par[x] = new Array(width_grid); 
        go_dirs[x] = new Array(width_grid);
        for(let y = 0; y < width_grid ; y ++)
        {
            visited[x][y] = 0;
        }
    }
    prevDir.push(d);
    que.push(snake);
    visited[snake[0].x/box][snake[0].y/box] = 1;
    go_dirs[snake[0].x/box][snake[0].y/box] = "stop";
    while(que.length > 0){
        let tp_sn = que[0];
        let prev_dir = prevDir[0];
        que.shift();
        prevDir.shift();
        if((tp_sn[0].x == food_pos.x) && (tp_sn[0].y == food_pos.y))
            break;
        
        for(let i = 0; i < dirs.length; i ++){
            if(dirs[i] != rev(prev_dir)){
                let nw_snake = make_new_snake(tp_sn, dirs[i]);
                if((!check_game_over(nw_snake[0], tp_sn)) && (visited[nw_snake[0].x/box][nw_snake[0].y/box] == 0)){
                    que.push(nw_snake);
                    prevDir.push(dirs[i]);
                    visited[nw_snake[0].x/box][nw_snake[0].y/box] = 1;
                    par[nw_snake[0].x/box][nw_snake[0].y/box] = tp_sn[0];
                    go_dirs[nw_snake[0].x/box][nw_snake[0].y/box] = dirs[i];
                }
            }
        }
    }   
    let st = {
        x: food_pos.x,
        y: food_pos.y
    };
    if(visited[st.x/box][st.y/box] == 0)
        return;
    while((st != undefined) && (go_dirs[st.x/box][st.y/box] != "stop")){
        Found_dirs.push(go_dirs[st.x/box][st.y/box]);
        let go_to = par[st.x/box][st.y/box];
        st = go_to;
    }
    d = Found_dirs[Found_dirs.length - 1];
    Found_dirs.pop();
}

function check_game_over(head, snake) {
    //game over or pause
    if((head.x < off) || (head.x >= (width_grid * box)))
    {
        return true;
    }    
    
    if((head.y < 0) || (head.y >= width_grid * box))
    {
        return true;
    }    
    if(sites_of_blocks[head.x/box][head.y/box] == 1)
        return true;
    for(i = 1; i <= snake.length - 1;i ++ )
    {
        if((head.x == snake[i].x) && (head.y == snake[i].y))
        {
            return true;
        }    
    }
    return false;
}

// move in same direction until a necessary to change
// whether due to danger or if we get a same coordinate as
// food then if no obstacles come in between then change direction
function req_dir() {
    let ImpToChange = false;
    let old_d = d;
    prob_head = make_new_head(snake, d);
    ImpToChange = check_game_over(prob_head, snake) ;

    if( ((old_d == "right") || (old_d == "left")) )
    {
        if((ImpToChange) || ((food_pos.x == snake[0].x) && (!check_food_in_x()) ))
        {
            if(food_pos.y > snake[0].y){
                d = "down" ;
                prob_head = make_new_head(snake, d);
                if(check_game_over(prob_head, snake) == true)
                    d = "up";
            }
            else
            {
                d = "up";
                prob_head = make_new_head(snake, d);
                if(check_game_over(prob_head, snake) == true)
                    d = "down";
            }   
        }
    }
    else
    {
        if((ImpToChange) || (food_pos.x != snake[0].x))
        {
            if(food_pos.x > snake[0].x)
            {
                d = "right";
                prob_head = make_new_head(snake, d);
                if(check_game_over(prob_head, snake) == true)
                    d = "left";
            }
            else
            {
                d = "left";
                prob_head = make_new_head(snake, d);
                if(check_game_over(prob_head, snake) == true)
                    d = "right";
            }
        }
    }
    prob_head = make_new_head(snake, d);
    if(check_game_over(prob_head, snake) == true)   
        d = old_d ; 
}

function far_site_game_over(){
    let new_snake = [];
    for(i = 0 ; i < snake.length ; i++)
    {
        new_snake.push(snake[i]);
    }
    let old_d = d;
    let prob_head = make_new_head(snake, d);
    while(!check_game_over(prob_head)){
        new_snake.unshift(prob_head);
        if((food_pos.x != new_snake[0].x) || (food_pos.y != new_snake[0].y))
            new_snake.pop();
        prob_head = make_new_head(snake, d);
    }
    d = "up";
    prob_head = make_new_head(snake, d);
    let b1 = check_game_over(prob_head);
    d = "down";
    prob_head = make_new_head(snake, d);
    let b2 = check_game_over(prob_head);
    d = old_d;
    return (!b1 && !b2);
}

function check_food_in_y()
{
    if(snake[0].y != food_pos.y)
        return false;
    let low = Math.floor(Math.min(food_pos.x,snake[0].x)/box);
    let high = Math.floor(Math.max(food_pos.x,snake[0].x)/box);
    let y = Math.floor(snake[0].y/box);
    for(i = low; i <= high ; i ++)
    {
        if(sites_of_blocks[i][y] == 1)
            return true;
    }
    return false;
}

function check_food_in_x()
{
    if(snake[0].x != food_pos.x)
        return false;
    let low = Math.floor(Math.min(food_pos.y,snake[0].y)/box);
    let high = Math.floor(Math.max(food_pos.y,snake[0].y)/box);
    let x = Math.floor(snake[0].x/box);
    for(i = low; i <= high ; i ++)
    {
        if(sites_of_blocks[x][i] == 1)
            return true;
    }
    return false;
}

function f_game_over() {
    Object.assign(game_over_card.style,style_game_over);
    back_btn.style.transform = "translate(-50%,0%)";
    game_over.play();
    fin_score.innerHTML = score;
    score_box.style.transform = "translate(0%,0%)"
    speed_box.style.transform = "translate(0%,0%)"
    Object.assign(reset_btn.style,style_reset_btn);
    //reset_btn.style.transform = "translate(-50%,-50%)";
    Object.assign(cvs.style,canvas_game_over);
    clearInterval(game);
}

function reload() {
    count_box.innerHTML = "";
    clearInterval(count_i);
    click_on_back = true;
    if((game_start) && (game_over_card.style.visibility != "visible"))
    {
        f_game_over();
        setTimeout(function(){
            Object.assign(main_page[0].style,reset_turning);
        },1500);
    }
    else
        Object.assign(main_page[0].style,reset_turning);
    div_choose_level.style.display = "none";
    div_choose_strategy.style.display = "none";
    background.style.filter = "none";
    game_start = false;
    back_btn.style.transform = "translate(-50%,0%)";
}


function show_help() {
    back_btn.style.transform = "translate(-50%,-100%)";
    help.style.opacity = "1";
    help.style.display = "block";
    Object.assign(main_page[0].style,style_turning_page);
}

function swipedetect(el, callback){
  
    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = box, //required min distance traveled to be considered swipe
    restraint = 3 * box, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)
  
    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)
  
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= Math.abs(distX)){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= Math.abs(distY)){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}
  