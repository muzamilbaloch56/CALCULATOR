// Simple calculator logic
(function(){
  const outputEl = document.getElementById('output');
  const historyEl = document.getElementById('history');
  let current = '';
  let history = '';

  function updateDisplay(){
    outputEl.textContent = current === '' ? '00' : current;
    historyEl.textContent = history || '\u00A0'; // keep height
  }

  function pushValue(v){
    // prevent multiple leading zeros
    if(current === '0' && v === '0') return;
    if(current === '0' && v !== '.' ) current = v;
    else current += v;
    updateDisplay();
  }

  function doDelete(){ current = current.slice(0,-1); updateDisplay(); }
  function doClear(){ current = ''; history = ''; updateDisplay(); }

  function evaluateExpression(expr){
    // Replace unicode operators with JS ones
    expr = expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
    // percent handling: replace 'number%' with '(number/100)'
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    try{
      const result = Function('return (' + expr + ')')();
      if(result === undefined || Number.isNaN(result) || !isFinite(result)) return 'Error';
      return Math.round((result + Number.EPSILON) * 100000000) / 100000000;
    }catch(e){
      return 'Error';
    }
  }

  // Button handling
  document.querySelectorAll('button.key').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const val = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');
      if(action === 'clear') return doClear();
      if(action === 'del') return doDelete();
      if(action === 'equals'){
        if(!current) return;
        history = current;
        const res = evaluateExpression(current);
        current = String(res);
        updateDisplay();
        return;
      }
      // normal value buttons
      if(val) pushValue(val);
    })
  })

  // Keyboard support
  window.addEventListener('keydown', (e)=>{
    const k = e.key;
    if((/^[0-9]$/).test(k)) { pushValue(k); e.preventDefault(); return; }
    if(k === 'Enter' || k === '='){
      document.querySelector('[data-action="equals"]').click(); e.preventDefault(); return;
    }
    if(k === 'Backspace') { doDelete(); e.preventDefault(); return; }
    if(k === 'Escape') { doClear(); e.preventDefault(); return; }
    if(k === '.' ) { pushValue('.'); e.preventDefault(); return; }
    if(k === '+'||k === '-'||k === '*'||k === '/') { pushValue(k); e.preventDefault(); return; }
    if(k === '%') { pushValue('%'); e.preventDefault(); return; }
  })

  // initial
  updateDisplay();
})();
