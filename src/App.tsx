import {useEffect,useMemo,useState} from 'react';
import {getCurrentWindow} from '@tauri-apps/api/window';
import {useAppStore} from './store';
import {dayInfo,formatMoney,formatTime,levelFromXp,levelTitle,moneyFor} from './engine';
import {Clock3,Goal as GoalIcon,Settings2,Trophy,Palette,Minimize2,Maximize2,Sparkles,Minus,X,Pin,PinOff} from 'lucide-react';
import './styles.css';

const quotes=['今天也没有辞职成功。','你不是热爱工作，你只是热爱工资。','再熬一下。','工资正在缓慢靠近。','距离下班只剩最后一个人生。','今天辛苦了。'];
const appWindow=getCurrentWindow();

function App(){
  const s=useAppStore();
  const [now,setNow]=useState(new Date());
  const [tab,setTab]=useState<'today'|'goal'|'achievements'|'settings'>('today');
  const [showQuote,setShowQuote]=useState(true);
  const info=useMemo(()=>dayInfo(now,s.schedules),[now,s.schedules]);
  const dailySalary=s.salary/s.workingDays;
  const hourly=s.workHours?dailySalary/s.workHours:0;
  const earned=moneyFor(info.workedMinutes,s.salary,s.workingDays,s.workHours);
  const lvl=levelFromXp(s.totalXp);
  const xp=s.totalXp%300;
  const goal=s.goal;
  const goalProgress=goal?Math.min(1,earned/goal.price):0;

  useEffect(()=>{
    const id=window.setInterval(()=>setNow(new Date()),1000);
    return()=>clearInterval(id)
  },[]);

  useEffect(()=>{document.documentElement.dataset.theme=s.theme},[s.theme]);

  useEffect(()=>{
    void appWindow.setAlwaysOnTop(s.alwaysOnTop);
  },[s.alwaysOnTop]);

  const quote=quotes[now.getDate()%quotes.length];
  const toggleCompact=()=>s.setCompact(!s.compact);

  return <div className={`app ${s.compact?'compact':''}`}>
    <header data-tauri-drag-region>
      <div className="brand" data-tauri-drag-region>
        <div className="brandMark">↗</div>
        <div><div className="brandName">再熬一下</div><div className="brandSub">今天也辛苦了</div></div>
      </div>
      <div className="headerRight">
        <div className="windowBtns">
          <button className="windowBtn" onClick={()=>void appWindow.minimize()} title="最小化"><Minus size={15}/></button>
          <button className="windowBtn" onClick={toggleCompact} title="切换紧凑模式">{s.compact?<Maximize2 size={15}/>:<Minimize2 size={15}/>}</button>
          <button className="windowBtn closeBtn" onClick={()=>void appWindow.close()} title="关闭"><X size={15}/></button>
        </div>
        <div className="headerBtns">
          <button className={`iconBtn ${s.alwaysOnTop?'selected':''}`} onClick={()=>s.setAlwaysOnTop(!s.alwaysOnTop)} title={s.alwaysOnTop?'取消置顶':'窗口置顶'}>{s.alwaysOnTop?<Pin size={17}/>:<PinOff size={17}/>}</button>
          <button className="iconBtn" onClick={()=>setTab('settings')}><Settings2 size={17}/></button>
        </div>
      </div>
    </header>

    <nav><button className={tab==='today'?'active':''} onClick={()=>setTab('today')}>今日</button><button className={tab==='goal'?'active':''} onClick={()=>setTab('goal')}>目标</button><button className={tab==='achievements'?'active':''} onClick={()=>setTab('achievements')}>成就</button><button className={tab==='settings'?'active':''} onClick={()=>setTab('settings')}>设置</button></nav>

    {tab==='today'&&<main className="today"><section className="hero card"><div className="eyebrow">{now.toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'})}</div><div className="heroLabel">今天已赚</div><div className="money">{formatMoney(earned)}</div><div className="perSec">+ {formatMoney(hourly/3600)} / 秒</div><div className="progressTrack"><div className="progressFill" style={{width:`${info.progress*100}%`}}/></div><div className="progressRow"><span>工作进度 {Math.round(info.progress*100)}%</span><strong>{info.isWorkday?formatTime(info.remainingMinutes):'周末休息'}</strong></div><div className="countdown">{info.isWorkday?(info.remainingMinutes>0?<><Clock3 size={16}/>距离下班 {formatTime(info.remainingMinutes)}</>:<>🎉 今天活下来了</>):'🛋️ 周末不用赚命'}</div></section>
    <section className="grid2"><div className="card stat"><span>日薪</span><strong>{formatMoney(dailySalary)}</strong><small>每月 {s.workingDays} 个工作日</small></div><div className="card stat"><span>时薪</span><strong>{formatMoney(hourly)}</strong><small>每分钟 {formatMoney(hourly/60)}</small></div></section>
    {goal&&<section className="card goalCard"><div className="cardTitle"><span><GoalIcon size={16}/> 当前愿望</span><button className="tinyLink" onClick={()=>setTab('goal')}>查看</button></div><h3>{goal.name}</h3><div className="goalMeta"><span>{Math.round(goalProgress*100)}%</span><span>{formatMoney(Math.max(0,goal.price-earned))} 还差</span></div><div className="progressTrack thin"><div className="progressFill" style={{width:`${goalProgress*100}%`}}/></div><div className="goalHint">按当前时薪，约还需要 <b>{formatTime(Math.max(0,(goal.price-earned)/(hourly||1)*60))}</b> 工作</div></section>}
    <section className="card companion"><div className="cat">🐱</div><div><div className="smallLabel">今日搭子 · Lv.{lvl} {levelTitle(lvl)}</div><div className="quote">{showQuote?quote:'再熬一下。'}</div></div><button className="quoteBtn" onClick={()=>setShowQuote(!showQuote)}><Sparkles size={16}/></button></section>
    </main>}

    {tab==='goal'&&<main><section className="card pageHead"><div className="eyebrow">我的愿望</div><h1>把工资变成你想要的东西。</h1><p>输入一个价格，剩余金额会实时换算成需要工作的时间。</p></section><section className="card formCard"><label>愿望名称<input value={goal?.name??''} onChange={e=>s.setGoal({id:goal?.id??crypto.randomUUID(),name:e.target.value,price:goal?.price??999,createdAt:goal?.createdAt??Date.now(),status:'active'})} placeholder="例如：新耳机"/></label><label>价格<input type="number" value={goal?.price??0} onChange={e=>s.setGoal({id:goal?.id??crypto.randomUUID(),name:goal?.name??'我的愿望',price:Math.max(0,Number(e.target.value)),createdAt:goal?.createdAt??Date.now(),status:'active'})}/></label><div className="goalBig"><span>按你的时薪</span><strong>{formatTime(Math.max(0,(goal?.price??0)/Math.max(hourly,0.01)*60))}</strong><small>完整买下这个愿望所需的工作时间</small></div></section></main>}

    {tab==='achievements'&&<main><section className="card pageHead"><div className="eyebrow">社畜图鉴</div><h1>Lv.{lvl} {levelTitle(lvl)}</h1><p>工作 1 分钟 = 1 XP。别卷，我们只是想把今天过完。</p><div className="xp"><div className="progressTrack thin"><div className="progressFill" style={{width:`${xp/3}%`}}/></div><span>{xp} / 300 XP</span></div></section><div className="achievementGrid">{[['🥚','第一次活着','第一次工作超过 1 小时'],['☕','咖啡续命','连续 5 天工作'],['🫠','老油条','累计工作 500 小时'],['🏃','准时跑路','连续 7 天准时下班'],['🐟','摸鱼宗师','累计摸鱼 100 小时'],['💰','第一桶社畜金','累计赚到 ¥10,000']].map(([i,t,d],idx)=><div className={`card achievement ${lvl*idx>=8?'unlocked':''}`} key={t}><div className="achIcon">{i}</div><div><b>{t}</b><small>{d}</small></div><span>{idx===0?'✓':idx<3?'◌':'🔒'}</span></div>)}</div></main>}

    {tab==='settings'&&<main><section className="card pageHead"><div className="eyebrow">我的打工档案</div><h1>让它更懂你的工作节奏。</h1><p>所有数据默认只保存在本机。</p></section><section className="card formCard"><label>月薪（税后）<input type="number" value={s.salary} onChange={e=>s.setSalary(Number(e.target.value))}/></label><label>每月工作日<input type="number" value={s.workingDays} onChange={e=>s.setWorkingDays(Number(e.target.value))}/></label><label>每天工作时长（小时）<input type="number" step="0.5" value={s.workHours} onChange={e=>s.setWorkHours(Number(e.target.value))}/></label><div className="schedule"><div className="cardTitle">工作时间</div>{s.schedules.map((r,i)=><div className="scheduleRow" key={i}><input value={r.start} onChange={e=>s.setSchedules(s.schedules.map((x,j)=>j===i?{...x,start:e.target.value}:x))}/><span>—</span><input value={r.end} onChange={e=>s.setSchedules(s.schedules.map((x,j)=>j===i?{...x,end:e.target.value}:x))}/></div>)}</div><button className="settingRow" onClick={()=>s.setAlwaysOnTop(!s.alwaysOnTop)}><span><b>窗口置顶</b><small>工作时也保持在桌面最上层</small></span><span className={`toggle ${s.alwaysOnTop?'on':''}`}><i/></span></button><div className="themeGrid">{(['midnight','mint','sakura','sunset','cyber'] as const).map(t=><button className={`themeChip ${s.theme===t?'selected':''}`} onClick={()=>s.setTheme(t)} key={t}><Palette size={15}/>{t}</button>)}</div></section></main>}

    <footer><span>今日 XP +{Math.floor(info.workedMinutes)} · Lv.{lvl}</span><span>再熬一下 · 0.1.0</span></footer>
  </div>
}
export default App;
