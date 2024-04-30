const CONTENT_DIVS=c('content');
const NAV=t('nav')[0];
const LEADERBOARD_SCORES_DIV=g('scoresres');
const HIGHSCORE_HOME_P=g('highscore-home');

function navBtn(d){for(let i of CONTENT_DIVS)i.style.display='none';g(d.innerHTML.toLowerCase()).style.display='block';if(d.innerHTML.toLowerCase() === 'leaderboard')loadLeaderboard();NAV.style.display='none';}
function backToNav(){for(let i of CONTENT_DIVS)i.style.display='none';NAV.style.display='block';}

