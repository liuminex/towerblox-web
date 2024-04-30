const h=window.innerHeight;
const w=window.innerWidth;
const bg_animation_duration=500; //ms
const block_dimension=110; //px
const PLAY_DIV=g('play');
const GAME_ACTIONS_DIV=g('game-actions');
const SCORE_LBL=g('score');
const LIVES=t('life');
const ACTIONS_CONTAINER=c('actions-container')[0];
const ENDGAME=g('endgame-actions');
const ENDGAME_SCORE=ENDGAME.getElementsByTagName('label')[1];
const NAME_INPUT=ENDGAME.getElementsByTagName('input')[0];
const LOADING_SCREEN=g('loading-screen');
const TOWLINE=g('towline');
const HOOK=g('hook');
var score=0;
var lives=3;
var playing=false;
var crane_moving=false;
let bg1=c('background-clouds')[0];
let bg2=c('background-clouds')[1];
let bg3=c('background-clouds')[2];
let bg1_top=(-2)*h;
var interval3,craneInterval1,craneInterval2;
var towline_top=0;

ACTIONS_CONTAINER.style.display='none';
GAME_ACTIONS_DIV.style.display='none';
ENDGAME.style.display="none";
const last_block_y=h-2*block_dimension;
let last_block_x_center=w/2;
let dropping_block_x_center=w/2;
const dropping_transition_duration=500;//ms
const perfect_collision_margin_side=5;//% of block_dimension
var interval5;
initGame();
var crane_has_block=true;

function el_blink(el,times=5,speed_ms=100,rm_after_blink=false){let p=el.style.display;if(p===undefined||p==="")p='inline-block';let interval18729587=setInterval(function(){el.style.display=p;el_blink_help_1(el,times,speed_ms,p,rm_after_blink);clearInterval(interval18729587);},speed_ms);}
function el_blink_help_1(el,t,speed,p,h){if(t<1){if(h)el.style.display='none';return;}el.style.display='none';let interval18729587=setInterval(function(){el.style.display=p;let interval218729587=setInterval(function(){el_blink_help_1(el,t-1,speed,p,h);clearInterval(interval218729587);},speed);clearInterval(interval18729587);},speed);}
function bubble_popup(text,x,y){const b=document.createElement('div');b.style.cssText="display:block;position:fixed;top:"+y+"px;left:"+x+"px;text-shadow:-2px 2px black;";b.innerHTML=text;fadeIn(b,PLAY_DIV);let interval2896508=setInterval(function(){fadeOut(b);clearInterval(interval2896508);},1500);}
function keep_dropping(el,deg=0){if(deg===1)el.classList.add('fallrotR');else if(deg===-1)el.classList.add('fallrotL');el.classList.add('keepfalling');el.style.top=h+block_dimension+'px';let interval185618=setInterval(function(){el.remove();clearInterval(interval185618);},2000);}
function moveTowerDown(){bg_clouds();const leftmove=w/2-dropping_block_x_center;for(let i of t('block')){const c=i.getBoundingClientRect();const i_y=c.bottom;i.style.top=nopx(i.style.top)+block_dimension+'px';const newleft=nopx(i.style.left)+leftmove;i.style.left=newleft+'px';last_block_x_center=newleft+block_dimension/2;}for(let i of t('block')){last_block_x_center=w/2;break;}let interval6=setInterval(function(){t('block')[0].remove();clearInterval(interval6);},500);}
function drop_element(e){crane_has_block=false;const dropping_block_y=nopx(e.style.top);const distance=last_block_y-(dropping_block_y+block_dimension);const r=e.getBoundingClientRect();dropping_block_x_center=r.left+block_dimension/2;const diver=dropping_block_x_center-last_block_x_center;const perfectcollisionpixels=block_dimension*perfect_collision_margin_side/100;let collision_type="unset";e.classList.add('dropping');e.style.top=dropping_block_y+distance+'px';interval5=setInterval(function(){e.classList.remove('dropping');e.classList.add('moving_down');if(diver>=block_dimension){collision_type='no collision right';reduceLife();keep_dropping(e);}else if(diver*(-1)>block_dimension){collision_type='no collision left';reduceLife();keep_dropping(e);}else if(diver>block_dimension*0.4){collision_type='unstable collision right';reduceLife();keep_dropping(e,1);}else if(diver*(-1)>block_dimension*0.4){collision_type='unstable collision left';reduceLife();keep_dropping(e,-1);}else if((diver<perfectcollisionpixels&&diver>0) || (diver*(-1)<perfectcollisionpixels&&diver<0)){collision_type='perfect collision';increaseScore(350);bubble_popup('PERFECT! +350',w/2,h/2);moveTowerDown();}else{collision_type='stable collision';increaseScore(150);moveTowerDown();}addBlockToCrane();clearInterval(interval5);},dropping_transition_duration);}
function runActionsContainer(which='game'){ACTIONS_CONTAINER.style.display='block';if(which==='game'){if(GAME_ACTIONS_DIV.style.display==='none'){GAME_ACTIONS_DIV.style.display='block';ENDGAME.style.display="none";pauseCrane();}else if(!playing){GAME_ACTIONS_DIV.style.display='none';ENDGAME.style.display="block";}else runActionsContainer('hide');}else if(which==='endgame'){ACTIONS_CONTAINER.style.display='block';GAME_ACTIONS_DIV.style.display='none';ENDGAME_SCORE.innerHTML=score;ENDGAME.style.display="block";pauseCrane();}else if(which==='hide'){ENDGAME.style.display='none';ACTIONS_CONTAINER.style.display='none';GAME_ACTIONS_DIV.style.display='none';moveCrane();}else{console.warn('unknown else on runActionsContainer()');}}
function initGame(){lives=3;score=0;playing=true;bg_clouds();increaseScore(0);for(let i of LIVES)i.style.display='inline-block';purgeTag('block');const b1=document.createElement('block');const be=document.createElement('block');b1.className='block moving_down';be.className='entrance-block moving_down';b1.style.top=h-2*block_dimension+'px';be.style.top=h-block_dimension+'px';PLAY_DIV.appendChild(be);PLAY_DIV.appendChild(b1);runActionsContainer('hide');}
function onTouch(){if(!crane_has_block){console.log('invalid click: crane does not have block');return;}bg1_top+=block_dimension;if(lives<1){console.warn('game has ended - cant play');return;}releaseBlock();}
function reduceLife(){if(lives<0){console.warn('negative lives');return;}--lives;el_blink(LIVES[lives],5,100,true);if(lives<1)endGame();}
function increaseScore(val=10){score+=val;SCORE_LBL.innerHTML=score;updateSwingSpeed();}
function bg_clouds(){bg_clouds_help1();let interval1=setInterval(function(){bg_clouds_help2();clearInterval(interval1);},bg_animation_duration);}
function bg_clouds_help1(){bg1.style.top=bg1_top+'px';bg2.style.top=bg1_top+h+'px';bg3.style.top=bg1_top+h+h+'px';}
function bg_clouds_help2(){if(bg1_top>-h){bg3.remove();bg3=bg2;bg2=bg1;bg1_top-=h;bg1=document.createElement('div');bg1.className='background-clouds';bg1.style.top=bg1_top+'px';PLAY_DIV.appendChild(bg1);}}
function releaseBlock(){clearInterval(interval3);const theBlock=t('block')[t('block').length-1];drop_element(theBlock);}
function moveCrane(){stopCrane();if(crane_moving){console.warn('crane already moving');return;}crane_moving=true;startCrane();addBlockToCrane();}
function pauseCrane(){if(!crane_moving){console.warn('crane already stopped');return;}crane_moving=false;clearInterval(interval3);t('block')[t('block').length-1].remove();crane_has_block=false;stopCrane();}
function addBlockToCrane(){if(crane_has_block){console.warn('crane has a block already');return;}crane_has_block=true;const b=document.createElement('block');b.className='block';PLAY_DIV.appendChild(b);interval3=setInterval(function(){const center = TOWLINE.getBoundingClientRect();b.style.top=center.bottom+20+'px';let x=(center.left>window.innerWidth/2-3)?center.right:center.left;b.style.left=x-55+'px';},15);}
function startCrane(){updateSwingSpeed();craneInterval1=setInterval(function(){const center = TOWLINE.getBoundingClientRect();HOOK.style.top=center.bottom-5+'px';let x=(center.left>window.innerWidth/2-3)?center.right:center.left;HOOK.style.left=x-22+'px';},15);craneInterval2=setInterval(function(){towline_top=(towline_top===-60)?-10:-60;TOWLINE.style.top=towline_top+'px';},1500);}
function stopCrane(){TOWLINE.classList.remove("swing");TOWLINE.classList.remove("swingfast");TOWLINE.classList.remove("swingfast2");clearInterval(craneInterval1);clearInterval(craneInterval2);}
function updateSwingSpeed(){TOWLINE.classList.remove("swing");TOWLINE.classList.remove("swingfast");TOWLINE.classList.remove("swingfast2");if(score>1500)TOWLINE.className+='swingfast2';else if(score>800)TOWLINE.className+='swingfast';else TOWLINE.className+='swing';}
function endGame(){stopCrane();playing=false;LOADING_SCREEN.style.display='block';

LOADING_SCREEN.style.display='none';runActionsContainer('endgame');

}
function updateScoreName(){if(NAME_INPUT.value.trim().length<1){NAME_INPUT.style.border="solid red";let interval498587=setInterval(function(){NAME_INPUT.style.border="none";clearInterval(interval498587);},700);return;}LOADING_SCREEN.style.display='block';

alert('leaderboard and score submitting are currently disabled');
LOADING_SCREEN.style.display='none';backToNav();

}




















