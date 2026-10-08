/* Meal description estimator v5. Local-only, approximate food data; no AI or network calls. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const db = (typeof foodDB !== 'undefined') ? foodDB : {};
  const make = (cal,protein,carbs,fat,fiber) => ({cal,protein,carbs,fat,fiber});
  // Nutrition is approximate per 100 g. The base food database comes from the meal builder.
  const catalog = [
    ['Eggs',['whole eggs','scrambled eggs','boiled eggs','fried eggs','eggs','egg'],'Whole egg',50,{egg:50,piece:50}],
    ['Egg whites',['egg whites','egg white'], 'Egg whites',99,{egg:33,piece:33,cup:243}],
    ['Avocado toast',['avocado toast'],make(193,6,21,11,6),80,{slice:80,piece:80}],
    ['Toast / bread',['whole wheat toast','whole grain toast','wheat toast','whole wheat bread','whole grain bread','toast','bread'], 'Whole-wheat bread',30,{slice:30,piece:30}],
    ['Avocado',['avocados','avocado'], 'Avocado',75,{piece:150,cup:150}],
    ['Chicken breast',['grilled chicken breast','cooked chicken breast','chicken breast','grilled chicken','chicken'], 'Cooked chicken breast',120,{cup:140,piece:120}],
    ['Chicken thigh',['chicken thighs','chicken thigh'], 'Cooked chicken thigh, skinless',120,{piece:110,cup:140}],
    ['Salmon',['salmon fillet','salmon'],make(206,22,0,12,0),130,{piece:130}],
    ['Turkey',['turkey breast','turkey'],make(135,29,0,1.5,0),110,{slice:25,piece:110}],
    ['Lean beef',['lean ground beef','ground beef','beef','steak'], 'Lean beef, cooked',120,{piece:120}],
    ['Tuna',['canned tuna','tuna'], 'Canned tuna in water, drained',120,{can:120}],
    ['Tofu',['extra firm tofu','extra-firm tofu','tofu'], 'Extra-firm tofu',150,{piece:150,cup:130}],
    ['Greek yogurt',['nonfat greek yogurt','greek yogurt','yogurt'], 'Kirkland nonfat Greek yogurt',170,{cup:227}],
    ['Cottage cheese',['cottage cheese'], 'Cottage cheese 2%',150,{cup:226}],
    ['Protein powder',['whey protein powder','whey protein','protein powder','whey'],make(394,76,12,6,3),33,{scoop:33,tbsp:8}],
    ['White rice',['cooked white rice','white rice','cooked rice','rice'], 'White rice, cooked',158,{cup:158,bowl:200}],
    ['Brown rice',['brown rice'], 'Brown rice, cooked',158,{cup:195,bowl:200}],
    ['Quinoa',['cooked quinoa','quinoa'], 'Quinoa, cooked',185,{cup:185}],
    ['Pasta',['cooked pasta','pasta','spaghetti'], 'Pasta, cooked',140,{cup:140,bowl:200}],
    ['Potato',['roasted potatoes','baked potato','potatoes','potato'], 'Potato, cooked',170,{piece:170,cup:150}],
    ['Sweet potato',['sweet potatoes','sweet potato'], 'Sweet potato, cooked',150,{piece:150,cup:200}],
    ['Chickpeas',['chickpeas','garbanzo beans'], 'Chickpeas, cooked',82,{cup:164}],
    ['Lentils',['cooked lentils','lentils'], 'Lentils, cooked',100,{cup:198}],
    ['Salad',['green salad','side salad','mixed salad','garden salad','salad greens','salad'],make(22,1.5,3.5,.2,1.7),100,{cup:40,bowl:120}],
    ['Mixed vegetables',['roasted vegetables','mixed vegetables','steamed vegetables','veggies','vegetables'],make(40,2,7,.5,2.7),120,{cup:120,bowl:160}],
    ['Broccoli',['broccoli'],make(35,2.4,7.2,.4,3.3),100,{cup:90}],
    ['Spinach',['spinach'],make(23,2.9,3.6,.4,2.2),60,{cup:30}],
    ['Tomato',['tomatoes','tomato'],make(18,.9,3.9,.2,1.2),100,{piece:120,cup:180}],
    ['Cucumber',['cucumbers','cucumber'],make(15,.7,3.6,.1,.5),100,{cup:100}],
    ['Carrots',['carrots','carrot'],make(41,.9,9.6,.2,2.8),70,{piece:70,cup:128}],
    ['Olive oil',['extra virgin olive oil','olive oil'], 'Olive oil',5,{tbsp:13.5,tsp:4.5}],
    ['Butter',['butter'],make(717,.9,.1,81,0),5,{tbsp:14,tsp:4.7}],
    ['Tahini',['tahini'], 'Tahini',15,{tbsp:15,tsp:5}],
    ['Hummus',['hummus'], 'Hummus',30,{tbsp:15,cup:240}],
    ['Peanut butter',['peanut butter'],make(588,25,20,50,6),16,{tbsp:16,tsp:5}],
    ['Almonds',['almonds','almond'],make(579,21.2,21.6,49.9,12.5),28,{piece:1.2,handful:28}],
    ['Walnuts',['walnut halves','walnuts','walnut'],make(654,15.2,13.7,65.2,6.7),28,{piece:2,handful:28}],
    ['Pecans',['pecan halves','pecans','pecan'],make(691,9.2,13.9,72,9.6),28,{piece:1.5,handful:28}],
    ['Banana',['bananas','banana'], 'Banana',118,{piece:118}],
    ['Apple',['apples','apple'], 'Apple',180,{piece:180}],
    ['Blueberries',['blueberries','blueberry'], 'Blueberries',75,{cup:148,tbsp:9}],
    ['Strawberries',['strawberries','strawberry'],make(32,.7,7.7,.3,2),150,{cup:152,piece:12}],
    ['Pomegranate',['pomegranate seeds','pomegranate arils','pomegranate'], 'Pomegranate arils',20,{tbsp:10,cup:174}],
    ['Rice cakes',['rice cakes','rice cake'], 'Rice cake',9,{piece:9}],
    ['Pita',['whole wheat pita','whole-wheat pita','pita bread','pita'], 'Whole-wheat pita',60,{piece:60}],
    ['Tortilla / wrap',['whole wheat tortilla','whole wheat wrap','tortilla','wrap'],make(310,9,51,8,5),60,{piece:60}],
    ['Honey',['honey'], 'Honey',7,{tbsp:21,tsp:7}],
    ['Jam',['fruit jam','jam'], 'Jam',20,{tbsp:20,tsp:7}],
    ['Feta cheese',['feta cheese','feta'],make(265,14,4,21,0),30,{tbsp:9,cup:150}],
    ['Cheese',['cheddar cheese','cheddar','cheese'],make(403,25,1.3,33,0),28,{slice:28,piece:28}],
    ['Milk',['skim milk','whole milk','milk'],make(50,3.4,4.8,2,0),244,{cup:244}],
    ['Granola',['granola'],make(471,10,64,20,5),40,{cup:110,tbsp:7}],
    ['Crackers',['crackers','cracker'],make(430,9,70,13,3),30,{piece:5,handful:30}]
  ].map(([name,aliases,source,defaultGrams,units])=>({name,aliases,per100:typeof source==='string'?db[source]:source,defaultGrams,units}));
  // Order longest aliases first to avoid "rice" matching "brown rice", etc.
  const aliases = catalog.flatMap(food=>food.aliases.map(alias=>({food,alias}))).sort((a,b)=>b.alias.length-a.alias.length);
  const recipeTotals = [
    ['usual greek yogurt protein bowl',make(480,49,38,18,7)],
    ['chicken quinoa avocado bowl',make(590,44,60,17,13)],
    ['chicken shawarma rice bowl',make(700,40,88,20,9)],
    ['mediterranean tuna pita',make(510,38,60,13,9)],
    ['tofu vegetable stir fry',make(650,34,80,22,10)],
    ['egg lentil potato bowl',make(560,38,60,18,12)],
    ['chicken pasta primavera',make(675,40,85,17,8)],
    ['tuna chickpea avocado salad',make(500,39,43,18,13)],
    ['tofu curry bowl',make(590,30,60,23,10)],
    ['chicken rice chickpea bowl',make(660,40,90,17,12)],
    ['beef fajita bowl',make(650,40,70,20,9)],
    ['chicken lentil mediterranean salad',make(560,35,60,17,14)],
    ['lemon garlic chicken potatoes',make(625,38,68,19,9)],
    ['egg potato post workout plate',make(600,38,68,19,9)]
  ];
  const normalize = s => String(s).toLowerCase().replace(/[–—-]/g,' ').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  const numberWord = {a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,half:.5,quarter:.25};
  const fractionMap = {'¼':.25,'½':.5,'¾':.75,'⅓':1/3,'⅔':2/3};
  const parseNum = s => {
    s=String(s).trim().toLowerCase();
    if(s in numberWord)return numberWord[s];
    if(s in fractionMap)return fractionMap[s];
    if(/^\d+\s+\d+\/\d+$/.test(s)){const [whole,fraction]=s.split(/\s+/);return Number(whole)+parseNum(fraction);}
    if(/^\d+\/\d+$/.test(s)){const [a,b]=s.split('/').map(Number);return b?a/b:NaN;}
    return Number(s);
  };
  const numberPattern='(?:\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?|[¼½¾⅓⅔]|half|quarter|one|two|three|four|five|six|an?|a)';
  const unitPattern='(?:tablespoons?|tbsp\\.?|teaspoons?|tsp\\.?|ounces?|oz\\.?|grams?|g|kilograms?|kg|cups?|slices?|pieces?|cans?|scoops?|handfuls?|bowls?|eggs?|rice cakes?|avocados?|bananas?|apples?|almonds?|walnut halves?|pecan halves?)';
  const amountUnit = new RegExp('('+numberPattern+')\\s*(?:of\\s+)?('+unitPattern+')(?:\\b|$)','i');
  const numberOnly = new RegExp('(?:^|\\s)('+numberPattern+')(?:\\s+an?)?(?:\\s+of)?(?:\\s|$)','i');
  const unitKey = raw => {
    const u=raw.toLowerCase().replace(/\.$/,'');
    if(/^(g|gram)/.test(u))return 'g';
    if(/^(kg|kilogram)/.test(u))return 'kg';
    if(/^(oz|ounce)/.test(u))return 'oz';
    if(/^(tbsp|tablespoon)/.test(u))return 'tbsp';
    if(/^(tsp|teaspoon)/.test(u))return 'tsp';
    if(/^cup/.test(u))return 'cup';
    if(/^slice/.test(u))return 'slice';
    if(/^can/.test(u))return 'can';
    if(/^scoop/.test(u))return 'scoop';
    if(/^handful/.test(u))return 'handful';
    if(/^bowl/.test(u))return 'bowl';
    return 'piece';
  };
  const gramsFor = (food,segment) => {
    const clean=segment.replace(/\b(?:i ate|i had|i\s+just\s+ate|for lunch|for dinner|for breakfast|about|approximately|around)\b/gi,'').replace(/\bhalf\s+(?:of\s+)?(?:an?\s+)?/gi,'0.5 ').replace(/\bquarter\s+(?:of\s+)?(?:an?\s+)?/gi,'0.25 ').trim();
    let amount=NaN,unit='piece',explicit=false;
    const m=clean.match(amountUnit);
    if(m){amount=parseNum(m[1]);unit=unitKey(m[2]);explicit=true;}
    else {
      const fraction=clean.match(/\b(half|quarter)\s+(?:of\s+)?(?:an?\s+)?/i);
      const n=clean.match(numberOnly);
      if(fraction){amount=parseNum(fraction[1]);explicit=true;}
      else if(n){amount=parseNum(n[1]);explicit=true;}
    }
    if(!Number.isFinite(amount)||amount<=0)amount=1,explicit=false;
    const unitGrams = unit==='g'?1:unit==='kg'?1000:unit==='oz'?28.3495:
      unit==='tbsp'?(food.units.tbsp||15):unit==='tsp'?(food.units.tsp||5):
      unit==='cup'?(food.units.cup||160):food.units[unit]||food.defaultGrams;
    let grams=amount*unitGrams;
    if(!explicit)grams=food.defaultGrams;
    if(!m && /\bsmall\b/i.test(clean))grams*=.7;
    if(!m && /\blarge\b/i.test(clean))grams*=1.4;
    return {grams:Math.min(3000,Math.round(grams)),assumed:!explicit};
  };
  const findFood = text => {
    const lower=text.toLowerCase();
    for(const a of aliases){
      const pos=lower.indexOf(a.alias);
      if(pos<0)continue;
      const before=pos===0?' ':lower[pos-1],after=lower[pos+a.alias.length]||' ';
      if(!/[a-z]/.test(before)&&!/[a-z]/.test(after))return a.food;
    }
    return null;
  };
  const totalFor = parts => {
    const sum=make(0,0,0,0,0);
    parts.forEach(part=>{
      for(const k of Object.keys(sum))sum[k]+=(part.food.per100[k]||0)*part.grams/100;
    });
    return sum;
  };
  const estimate = description => {
    const clean=description.trim();
    if(!clean)return {parts:[],unknown:[],totals:make(0,0,0,0,0)};
    const recipe=recipeTotals.find(([name])=>normalize(clean.replace(/^(i had|i ate|for lunch|for dinner|for breakfast)\s+/i,''))===name);
    if(recipe)return {recipe:true,parts:[],unknown:[],totals:recipe[1]};
    const segments=clean.replace(/^(i had|i ate|i just ate|for lunch|for dinner|for breakfast)\s+/i,'')
      .split(/\s*,\s*|\s*;\s*|\s*\+\s*|\s+and\s+|\s+with\s+|\s+on\s+|\s+over\s+|\s+plus\s+|\s+alongside\s+|\s+topped\s+with\s+/i).map(s=>s.trim()).filter(Boolean);
    const parts=[],unknown=[];
    segments.forEach(seg=>{
      const food=findFood(seg);
      if(!food || !food.per100){unknown.push(seg);return;}
      const portion=gramsFor(food,seg);
      parts.push({food,grams:portion.grams,assumed:portion.assumed,source:seg});
    });
    return {parts,unknown,totals:totalFor(parts)};
  };
  const fmt = n => Math.round(n*10)/10;
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let current=null;
  function applyTotals(t){
    $('logCal').value=Math.round(t.cal);
    $('logPro').value=fmt(t.protein);
    $('logCarb').value=fmt(t.carbs);
    $('logFat').value=fmt(t.fat);
    $('logFiber').value=fmt(t.fiber);
  }
  function renderEstimate(){
    const area=$('estimateResult');
    if(!current){area.hidden=true;area.innerHTML='';return;}
    area.hidden=false;
    const t=current.recipe?current.totals:totalFor(current.parts);
    current.totals=t;applyTotals(t);
    if(!$('logNotes').value.trim())$('logNotes').value='Estimated from description (approx.)';
    const summary=`<strong>Estimated total:</strong> ${Math.round(t.cal)} kcal · ${fmt(t.protein)} g protein · ${fmt(t.carbs)} g carbs · ${fmt(t.fat)} g fat · ${fmt(t.fiber)} g fiber`;
    const rows=current.parts.map((p,i)=>`<div class="estimate-food-row"><div><b>${esc(p.food.name)}</b><small>${esc(p.source)}${p.assumed?' · portion assumed':''}</small></div><label><input aria-label="${esc(p.food.name)} grams" type="number" min="1" max="3000" step="1" value="${p.grams}" data-estimate-grams="${i}"> g</label></div>`).join('');
    const unknown=current.unknown.length?`<p class="estimate-warning">Not included (please enter separately): ${current.unknown.map(esc).join('; ')}</p>`:'';
    const assumed=current.parts.some(p=>p.assumed)?`<p class="estimate-warning">Some portions were assumed. Change grams above for a better estimate.</p>`:'';
    const recipeNote=current.recipe?`<p class="muted">Matched a meal in your recipe plan; assumes one standard serving.</p>`:'';
    area.innerHTML=`<div class="estimate-total">${summary}</div>${recipeNote}${rows}${assumed}${unknown}<p class="muted" style="margin:10px 0 0">Estimate only. Cooking oil, sauces and dressings count only when listed. You can also edit the macro fields above.</p>`;
    area.querySelectorAll('[data-estimate-grams]').forEach(input=>input.addEventListener('input',()=>{
      const i=Number(input.dataset.estimateGrams),grams=Number(input.value);
      if(!Number.isFinite(grams)||grams<0)return;
      current.parts[i].grams=grams;
      const totals=totalFor(current.parts);current.totals=totals;applyTotals(totals);
      area.querySelector('.estimate-total').innerHTML=`<strong>Estimated total:</strong> ${Math.round(totals.cal)} kcal · ${fmt(totals.protein)} g protein · ${fmt(totals.carbs)} g carbs · ${fmt(totals.fat)} g fat · ${fmt(totals.fiber)} g fiber`;
    }));
  }
  // V6: Searchable meal library. Uses planned recipes, saved custom/photo meals,
  // and the most recent logged macros for meals the user has eaten before.
  function installMealPicker(field, result) {
    const cleanTotals = raw => {
      if (!raw || typeof raw !== 'object') return null;
      const keys = ['cal', 'protein', 'carbs', 'fat', 'fiber'];
      const totals = {};
      for (const key of keys) {
        if (raw[key] === undefined || raw[key] === null || raw[key] === '' || !Number.isFinite(Number(raw[key])) || Number(raw[key]) < 0) return null;
        totals[key] = Number(raw[key]);
      }
      return keys.some(key => totals[key] > 0) ? totals : null;
    };
    const plannedAlias = {
      'egg potato plate': 'Egg & Potato Post-Workout Plate'
    };
    const plannedTotals = name => {
      const canonical = plannedAlias[normalize(name)] || name;
      if (/\b(or|optional|if needed)\b/i.test(canonical)) return null;
      const value = estimate(canonical);
      if (value.recipe) return cleanTotals(value.totals);
      // Only infer an unsaved planned snack when its components are explicitly
      // listed and all are recognized. A name like "chicken pasta bowl" is not
      // enough to estimate a full recipe from a single matching word.
      if (/[+,]/.test(canonical) && !canonical.includes('/') && value.parts.length >= 2 && !value.unknown.length) return cleanTotals(value.totals);
      return null;
    };
    function mealLibrary() {
      const found = new Map();
      const add = (name, totals, source, priority, date = '') => {
        if (typeof name !== 'string' || !name.trim()) return;
        const key = normalize(name);
        if (!key) return;
        const entry = {name:name.trim(), totals:cleanTotals(totals), source, priority, date};
        const existing = found.get(key);
        // Prefer a usable macro profile to an empty one, then user meals to presets.
        if (existing && ((existing.totals && !entry.totals) ||
            (!!existing.totals === !!entry.totals && existing.priority > entry.priority))) return;
        found.set(key, entry);
      };
      add('Usual Greek yogurt protein bowl', plannedTotals('Usual Greek yogurt protein bowl'), 'Suggested meals', 2);
      recipes.forEach(recipe => add(recipe.name, plannedTotals(recipe.name), 'Suggested meals', 2));
      Object.values(dayMenus).forEach(day => day.meals.forEach(([, name]) => {
        if (/^water only/i.test(name)) return;
        add(name, plannedTotals(name), 'Suggested meals', 1);
      }));
      // Entries from the tracker become reusable automatically. The most recent
      // log for a name wins, unless a named custom meal overrides it.
      logs.forEach(log => add(log.meal, {
        cal:log.cal, protein:log.protein, carbs:log.carbs, fat:log.fat, fiber:log.fiber
      }, 'Previously logged', 3, log.date || ''));
      photoMeals.forEach(meal => add(meal.name, meal.totals, 'Photo meals', 4));
      customMeals.forEach(meal => add(meal.name, meal.totals, 'Your custom meals', 5));
      return Array.from(found.values()).sort((a,b) =>
        b.priority-a.priority || (a.source === 'Previously logged' && b.source === 'Previously logged' ? b.date.localeCompare(a.date) : 0) || a.name.localeCompare(b.name)
      );
    }

    const picker = document.createElement('div');
    picker.className = 'meal-picker';
    picker.innerHTML = `
      <div class="meal-picker-toolbar">
        <button type="button" id="browseMealsBtn" class="secondary" aria-expanded="false" aria-controls="mealPickerList">▾ Browse saved & suggested meals</button>
        <small>Or start typing above to search</small>
      </div>
      <div id="mealPickerList" class="meal-picker-list" hidden aria-label="Matching meals"></div>
      <div id="mealPickerStatus" class="meal-picker-status" role="status" hidden></div>`;
    field.insertAdjacentElement('afterend', picker);
    const browse = $('browseMealsBtn'), list = $('mealPickerList'), status = $('mealPickerStatus');
    let open = false, selected = false, selectedNeedsMacros = false;
    const setOpen = value => {
      open = value;
      list.hidden = !value;
      browse.setAttribute('aria-expanded', String(value));
      browse.textContent = value ? '▴ Close meal list' : '▾ Browse saved & suggested meals';
    };
    const showStatus = (message, warning = false) => {
      status.hidden = false;
      status.classList.toggle('warning', warning);
      status.textContent = message;
    };
    const hideStatus = () => { status.hidden = true; status.textContent = ''; };
    const clearMacros = () => ['logCal','logPro','logCarb','logFat','logFiber'].forEach(id => $(id).value = '');
    function choose(entry) {
      field.value = entry.name;
      current = null;
      result.hidden = true;
      result.innerHTML = '';
      selected = true;
      selectedNeedsMacros = !entry.totals;
      if (entry.totals) {
        applyTotals(entry.totals);
        showStatus(`Filled from ${entry.source.toLowerCase()}. Macros are approximate; check the portion size before logging.`);
      } else {
        clearMacros();
        showStatus('This suggested meal has no complete macro profile yet. Enter ingredients and tap Estimate macros, or fill the nutrition fields manually.', true);
      }
      setOpen(false);
    }
    function render(query = '') {
      const filter = normalize(query);
      const matches = mealLibrary().filter(entry => normalize(entry.name).includes(filter));
      list.replaceChildren();
      if (!matches.length) {
        const empty = document.createElement('p');
        empty.className = 'muted';
        empty.textContent = 'No matching saved meal. You can still estimate a new description and log it to reuse later.';
        list.appendChild(empty);
        return;
      }
      let lastGroup = '';
      for (const entry of matches) {
        if (entry.source !== lastGroup) {
          lastGroup = entry.source;
          const heading = document.createElement('div');
          heading.className = 'meal-picker-group';
          heading.textContent = lastGroup;
          list.appendChild(heading);
        }
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'meal-picker-choice';
        const title = document.createElement('strong');
        title.textContent = entry.name;
        const sub = document.createElement('small');
        const t = entry.totals;
        sub.textContent = t ? `${Math.round(t.cal)} kcal · ${fmt(t.protein)}g protein · ${fmt(t.carbs)}g carbs · ${fmt(t.fat)}g fat · ${fmt(t.fiber)}g fiber` : 'Nutrition not yet saved — estimate before logging';
        button.append(title, sub);
        button.addEventListener('click', () => choose(entry));
        list.appendChild(button);
      }
    }
    browse.addEventListener('click', () => {
      if (open) { setOpen(false); return; }
      render('');
      setOpen(true);
    });
    field.addEventListener('input', () => {
      if (selected) {
        selected = false;
        selectedNeedsMacros = false;
        clearMacros();
        showStatus('Meal description changed. Select a meal again or tap Estimate macros before logging.', true);
      } else {
        hideStatus();
      }
      if (field.value.trim()) {
        render(field.value);
        setOpen(true);
      } else {
        setOpen(false);
      }
    });
    field.addEventListener('focus', () => {
      if (field.value.trim()) { render(field.value); setOpen(true); }
    });
    field.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
    $('estimateMacrosBtn').addEventListener('click', () => {
      setOpen(false);
      selected = false;
      selectedNeedsMacros = false;
      hideStatus();
    });
    const previousAddLog = window.addLog;
    window.addLog = function () {
      if (selectedNeedsMacros && ['logCal','logPro','logCarb','logFat','logFiber'].every(id => !$(id).value.trim())) {
        alert('This meal has no saved macros yet. Please estimate or enter its nutrition values before logging.');
        return;
      }
      const before = logs.length;
      previousAddLog();
      if (logs.length > before) {
        selected = false;
        selectedNeedsMacros = false;
        hideStatus();
        setOpen(false);
      }
    };
    // Small test API; no personal meal data is sent anywhere.
    window.nutritionMealLibrary = mealLibrary;
  }

  function install(){
    const field=$('logMeal');
    if(!field)return;
    const action=document.createElement('div');
    action.className='estimate-actions';
    action.innerHTML='<button type="button" id="estimateMacrosBtn" class="primary">✨ Estimate macros</button><small>Separate foods with commas; include portions when possible.</small>';
    field.parentElement.appendChild(action);
    const result=document.createElement('div');
    result.id='estimateResult';result.className='estimate-result';result.hidden=true;
    field.closest('.formgrid').insertAdjacentElement('afterend',result);
    $('estimateMacrosBtn').addEventListener('click',()=>{
      current=estimate(field.value);
      if(!current.recipe && !current.parts.length){
        result.hidden=false;
        applyTotals(make(0,0,0,0,0));
        result.innerHTML=`<p class="estimate-warning">I couldn't identify enough foods to estimate this meal. Try listing ingredients and amounts, e.g., “2 eggs, 2 slices toast, half avocado.”</p>`;
        return;
      }
      renderEstimate();
    });
    field.addEventListener('input',()=>{
      if(current && !result.hidden){
        const warning=$('estimateStale')||document.createElement('p');
        warning.id='estimateStale';warning.className='estimate-warning';
        warning.textContent='Description changed — tap Estimate macros again before logging.';
        result.appendChild(warning);
        current=null;
      }
    });
    const original=window.addLog;
    if(typeof original==='function')window.addLog=function(){
      const count=logs.length;original();
      if(logs.length>count){current=null;result.hidden=true;result.innerHTML='';}
    };
    // Mobile navigation: give access to every existing tab, including Settings and Custom Meals.
    const moreButton=document.querySelector('[data-mobile-tab="recipes"]');
    if(moreButton){
      moreButton.dataset.mobileTab='more';
      moreButton.innerHTML='<span class="ico">☰</span><span>More</span>';
      const sheet=document.createElement('div');sheet.id='moreSheet';sheet.hidden=true;
      sheet.innerHTML='<div class="more-sheet-backdrop"></div><div class="more-sheet-content" role="dialog" aria-label="More sections"><h3>More sections</h3><div class="more-sheet-buttons"></div><button type="button" id="closeMore" class="secondary">Close</button></div>';
      document.body.appendChild(sheet);
      const sections=[['menu','7-Day Menu'],['recipes','Recipes'],['prep','Meal Prep'],['custom','Custom Meals'],['report','Weekly Report'],['settings','Settings']];
      const list=sheet.querySelector('.more-sheet-buttons');
      sections.forEach(([tab,name])=>{
        const b=document.createElement('button');b.textContent=name;b.className='secondary';
        b.onclick=()=>{sheet.hidden=true;window.goTab(tab)};list.appendChild(b);
      });
      moreButton.onclick=()=>{sheet.hidden=false};
      sheet.querySelector('.more-sheet-backdrop').onclick=()=>sheet.hidden=true;
      sheet.querySelector('#closeMore').onclick=()=>sheet.hidden=true;
    }
    installMealPicker(field, result);
  }
  const style=document.createElement('style');
  style.textContent=`
    .estimate-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}
    .estimate-actions small{font-weight:400;max-width:270px}
    .estimate-result{margin-top:14px;padding:14px;border-radius:14px;background:#eef3ef;border:1px solid #d6e4d9}
    .estimate-result[hidden],#moreSheet[hidden]{display:none!important}
    .estimate-total{font-size:.98rem;margin-bottom:10px}
    .estimate-food-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:9px 0;border-top:1px solid #d6e4d9}
    .estimate-food-row small{display:block;color:#66736b;margin-top:3px;font-weight:400}
    .estimate-food-row label{display:flex;align-items:center;gap:5px;flex-shrink:0}
    .estimate-food-row input{width:84px;text-align:right;font-size:16px}
    .estimate-warning{color:#86551b;font-size:.87rem;line-height:1.4}
    #moreSheet{position:fixed;inset:0;z-index:90}
    .more-sheet-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.48)}
    .more-sheet-content{position:absolute;bottom:0;left:0;right:0;background:white;padding:20px 16px calc(20px + env(safe-area-inset-bottom));border-radius:20px 20px 0 0;max-height:80vh;overflow:auto}
    .more-sheet-buttons{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:14px 0}
    .more-sheet-buttons button{min-height:55px}
    .meal-picker-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin-top:9px}
    .meal-picker-toolbar button{min-height:44px}
    .meal-picker-toolbar small{font-weight:400}
    .meal-picker-list{margin-top:8px;max-height:290px;overflow-y:auto;overscroll-behavior:contain;border:1px solid #d7dfda;border-radius:12px;background:#fff;box-shadow:0 4px 14px rgba(0,0,0,.07)}
    .meal-picker-list[hidden],.meal-picker-status[hidden]{display:none!important}
    .meal-picker-list>p{padding:10px}
    .meal-picker-group{position:sticky;top:0;background:#eef3ef;padding:9px 12px;color:#465d50;font-size:.79rem;font-weight:750;letter-spacing:.01em;border-bottom:1px solid #d7dfda}
    .meal-picker-choice{display:block;text-align:left;width:100%;background:#fff;border-radius:0;border-bottom:1px solid #edf0ee;padding:12px;min-height:62px;font-weight:400}
    .meal-picker-choice:last-child{border-bottom:0}
    .meal-picker-choice:active,.meal-picker-choice:focus-visible{background:#eef3ef;outline:2px solid #789785;outline-offset:-2px}
    .meal-picker-choice strong{display:block;font-size:.93rem}
    .meal-picker-choice small{display:block;font-size:.8rem;color:#66736b;margin-top:4px;line-height:1.4}
    .meal-picker-status{margin-top:8px;border-radius:10px;background:#eef3ef;padding:10px;font-size:.84rem;color:#355742;line-height:1.4}
    .meal-picker-status.warning{background:#fff8e6;color:#86551b}
  `;
  document.head.appendChild(style);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);
  else install();
  // Expose a pure helper for smoke tests, not used by the UI.
  window.nutritionEstimateDescription=estimate;
})();
