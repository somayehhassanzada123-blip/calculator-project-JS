const expressionEl=document.querySelector('#expression');
const resultEl=document.querySelector('#result');
const keypad=document.querySelector('#keypad');
const themeBtn=document.querySelector('#themeBtn');
const symbols={'+':'+','-':'−','*':'×','/':'÷'};
let current='0',previous='',operator=null,waiting=false,justCalculated=false,error=false;
const fresh=()=>{current='0';previous='';operator=null;waiting=false;justCalculated=false;error=false};
function formatNumber(value){if(!Number.isFinite(value))return 'Error';const rounded=Number(value.toPrecision(11));return String(rounded)}
function inputDigit(d){if(error)fresh();if(waiting||justCalculated){current=d;waiting=false;justCalculated=false}else if(current==='0'){current=d}else if(current.replace('-','').length<13){current+=d}update()}
function inputDecimal(){if(error)fresh();if(waiting||justCalculated){current='0.';waiting=false;justCalculated=false}else if(!current.includes('.'))current+='.';update()}
function chooseOperator(op){if(error)return;if(operator&&!waiting){const computed=calculate(Number(previous),Number(current),operator);if(computed==='Error'){setError();return}current=computed;previous=current}else{previous=current}operator=op;waiting=true;justCalculated=false;update()}
function calculate(a,b,op){let n;switch(op){case'+':n=a+b;break;case'-':n=a-b;break;case'*':n=a*b;break;case'/':if(b===0)return 'Error';n=a/b;break;default:return String(b)}return formatNumber(n)}
function equals(){if(!operator||waiting||error)return;const left=previous,right=current,op=operator;const answer=calculate(Number(left),Number(right),op);expressionEl.textContent=`${left} ${symbols[op]} ${right} =`;if(answer==='Error'){setError();return}current=answer;previous='';operator=null;waiting=false;justCalculated=true;update(false)}
function setError(){current='Error';previous='';operator=null;waiting=false;error=true;update()}
function clear(){fresh();update()}
function sign(){if(error||current==='0')return;current=current.startsWith('-')?current.slice(1):'-'+current;update()}
function percent(){if(error)return;current=formatNumber(Number(current)/100);waiting=false;update()}
function update(clearExpression=true){resultEl.textContent=current;resultEl.classList.toggle('small',current.length>9);if(clearExpression&&operator)expressionEl.textContent=`${previous} ${symbols[operator]}`;else if(clearExpression&&!operator)expressionEl.textContent='';keypad.querySelectorAll('.operator').forEach(b=>b.classList.toggle('active',b.dataset.value===operator))}
keypad.addEventListener('click',e=>{const b=e.target.closest('.key');if(!b)return;const{action,value}=b.dataset;switch(action){case'digit':inputDigit(value);return;case'decimal':inputDecimal();return;case'operator':chooseOperator(value);return;case'equals':equals();return;case'clear':clear();return;case'sign':sign();return;case'percent':percent();return}});
function applyTheme(t){document.body.dataset.theme=t;themeBtn.textContent=t==='dark'?'☼':'◐';try{localStorage.setItem('noirCalcTheme',t)}catch{}}
themeBtn.addEventListener('click',()=>applyTheme(document.body.dataset.theme==='dark'?'light':'dark'));
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key;let selector=null;if(/^\d$/.test(k))selector=`[data-value="${k}"]`;else if(['+','-','*','/'].includes(k))selector=`[data-value="${k}"]`;else if(k==='.'||k===',')selector='[data-action="decimal"]';else if(k==='Enter'||k==='=')selector='[data-action="equals"]';else if(k==='Escape'||k==='Delete')selector='[data-action="clear"]';else if(k==='%')selector='[data-action="percent"]';else if(k==='_')selector='[data-action="sign"]';if(!selector)return;e.preventDefault();const b=keypad.querySelector(selector);if(b){b.classList.add('pressed');b.click();setTimeout(()=>b.classList.remove('pressed'),120)}});
let theme='dark';try{theme=localStorage.getItem('noirCalcTheme')||'dark'}catch{}applyTheme(theme);update();
