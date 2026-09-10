const K='naneice-v4';
const DAYS=['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const today=()=>new Date().toISOString().slice(0,10);
const dow=d=>{const x=new Date(d+'T12:00:00');return x.getDay()};
const fmt=d=>{try{return new Date(d+'T12:00:00').toLocaleDateString('ar-EG',{year:'numeric',month:'short',day:'numeric'})}catch{return d||'—'}};
const money=n=>Number(n||0).toLocaleString('ar-EG');
const load=()=>{try{return JSON.parse(localStorage.getItem(K))||null}catch{return null}};
const save=()=>localStorage.setItem(K,JSON.stringify(data));
let data=load()||{pin:'1234',teacherName:'د. نانيس الشيمي',students:[],sessions:[],groups:[],homework:[],finance:[],timetable:[]};
if(!data.groups)data.groups=[];
if(!data.homework)data.homework=[];
if(!data.finance)data.finance=[];
if(!data.timetable)data.timetable=[];
let auth=sessionStorage.getItem('na')==='1', page='home', modal=null;
function ensureTodayFromTimetable(){
  const t=today(), day=dow(t);
  const slots=(data.timetable||[]).filter(s=>s.active!==false&&Number(s.day)===day);
  slots.forEach(s=>{
    const exists=data.sessions.some(x=>x.date===t&&x.studentId===s.studentId&&x.time===s.time&&x.fromTimetable);
    if(!exists){
      const st=data.students.find(x=>x.id===s.studentId);
      data.sessions.push({id:uid(),studentId:s.studentId,studentName:st?st.name:s.studentName,date:t,time:s.time,dur:s.dur||60,status:'scheduled',fromTimetable:true});
    }
  });
  save();
}
const stats=()=>{
  ensureTodayFromTimetable();
  const t=data.sessions.filter(s=>s.date===today());
  const inc=data.finance.filter(f=>f.type==='income').reduce((a,f)=>a+Number(f.amount),0);
  const exp=data.finance.filter(f=>f.type==='expense').reduce((a,f)=>a+Number(f.amount),0);
  return{
    total:data.students.length,
    active:data.students.filter(s=>s.remainingSessions>0).length,
    expired:data.students.filter(s=>s.remainingSessions<=0).length,
    low:data.students.filter(s=>s.remainingSessions>0&&s.remainingSessions<=3).length,
    today:t.length,done:t.filter(s=>s.status==='completed').length,up:t.filter(s=>s.status==='scheduled').length,
    groups:data.groups.length,hwOpen:data.homework.filter(h=>h.status!=='done').length,
    income:inc,expense:exp,net:inc-exp,tt:(data.timetable||[]).filter(x=>x.active!==false).length
  };
};
function seed(){
  if(data.students.length)return;
  const a={id:uid(),name:'مريم أحمد',subject:'علوم',level:'الصف السابع',totalSessions:12,remainingSessions:5,end:today()};
  const b={id:uid(),name:'يوسف محمود',subject:'علوم',level:'الصف السادس',totalSessions:8,remainingSessions:2,end:today()};
  const c={id:uid(),name:'لينا سامي',subject:'علوم',level:'الصف السابع',totalSessions:10,remainingSessions:0,end:today()};
  data.students=[a,b,c];
  data.timetable=[
    {id:uid(),studentId:a.id,studentName:a.name,day:0,time:'16:00',dur:60,active:true},
    {id:uid(),studentId:b.id,studentName:b.name,day:2,time:'17:30',dur:60,active:true},
    {id:uid(),studentId:a.id,studentName:a.name,day:4,time:'16:00',dur:60,active:true},
    {id:uid(),studentId:c.id,studentName:c.name,day:1,time:'15:00',dur:45,active:true}
  ];
  data.groups=[{id:uid(),name:'علوم 7أ',subject:'علوم',capacity:6,memberIds:[a.id],active:true}];
  data.homework=[{id:uid(),studentId:a.id,studentName:a.name,title:'ورقة الخلية',due:today(),status:'pending'}];
  data.finance=[{id:uid(),type:'income',amount:500,note:'اشتراك مريم',date:today()},{id:uid(),type:'expense',amount:80,note:'أوراق عمل',date:today()}];
  ensureTodayFromTimetable();
  save();render();
}
function go(p){page=p;modal=null;render()}
function login(e){e.preventDefault();if(document.getElementById('pin').value.trim()===data.pin){auth=true;sessionStorage.setItem('na','1');render()}else document.getElementById('err').textContent='رمز الدخول غير صحيح';return false}
function openTt(id){modal={t:'tt',id:id||null};render()}
function openSt(id){modal={t:'st',id:id||null};render()}
function openSe(){modal={t:'se'};render()}
function openFi(id){modal={t:'fi',id};render()}
function openGr(id){modal={t:'gr',id:id||null};render()}
function openHw(){modal={t:'hw'};render()}
function openFn(){modal={t:'fn'};render()}
function delTt(id){if(confirm('حذف الموعد الأسبوعي؟')){data.timetable=data.timetable.filter(s=>s.id!==id);save();render()}}
function togTt(id){data.timetable=data.timetable.map(s=>s.id===id?{...s,active:s.active===false}:s);save();render()}
function delSt(id){if(confirm('حذف الطالب؟')){data.students=data.students.filter(s=>s.id!==id);data.sessions=data.sessions.filter(s=>s.studentId!==id);data.homework=data.homework.filter(h=>h.studentId!==id);data.timetable=(data.timetable||[]).filter(t=>t.studentId!==id);data.groups=data.groups.map(g=>({...g,memberIds:(g.memberIds||[]).filter(m=>m!==id)}));save();render()}}
function delSe(id){data.sessions=data.sessions.filter(s=>s.id!==id);save();render()}
function delGr(id){if(confirm('حذف المجموعة؟')){data.groups=data.groups.filter(g=>g.id!==id);save();render()}}
function delHw(id){data.homework=data.homework.filter(h=>h.id!==id);save();render()}
function delFn(id){data.finance=data.finance.filter(f=>f.id!==id);save();render()}
function togGr(id){data.groups=data.groups.map(g=>g.id===id?{...g,active:g.active===false}:g);save();render()}
function doneHw(id){data.homework=data.homework.map(h=>h.id===id?{...h,status:'done'}:h);save();render()}
function start(id){data.sessions=data.sessions.map(s=>s.id===id?{...s,status:'active'}:s);save();render()}
function renew(id){data.students=data.students.map(s=>s.id===id?{...s,remainingSessions:s.remainingSessions+8,totalSessions:s.totalSessions+8}:s);save();render()}
function sv(){data.teacherName=document.getElementById('tn').value.trim()||data.teacherName;data.pin=document.getElementById('tp').value.trim()||data.pin;save();alert('تم الحفظ');render()}
function exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='naneice-backup.json';a.click()}
function imp(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{data=JSON.parse(r.result);if(!data.groups)data.groups=[];if(!data.homework)data.homework=[];if(!data.finance)data.finance=[];if(!data.timetable)data.timetable=[];save();alert('تمت الاستعادة');render()}catch{alert('ملف غير صالح')}};r.readAsText(f)}
function saveTt(e){e.preventDefault();const f=new FormData(e.target);const sid=f.get('sid').toString();const st=data.students.find(s=>s.id===sid);if(!st)return false;
  const p={studentId:sid,studentName:st.name,day:+f.get('day'),time:f.get('time').toString(),dur:+f.get('dur')||60,active:true};
  if(modal.id)data.timetable=data.timetable.map(s=>s.id===modal.id?{...s,...p}:s);
  else data.timetable.push({id:uid(),...p});
  ensureTodayFromTimetable();save();modal=null;render();return false}
function saveSt(e){e.preventDefault();const f=new FormData(e.target);const p={name:f.get('name').toString().trim(),subject:f.get('subject').toString().trim(),level:f.get('level').toString().trim(),totalSessions:+f.get('total')||0,remainingSessions:+f.get('rem')||0,end:today()};if(modal.id)data.students=data.students.map(s=>s.id===modal.id?{...s,...p}:s);else data.students.unshift({id:uid(),...p});save();modal=null;render();return false}
function saveSe(e){e.preventDefault();const f=new FormData(e.target);const sid=f.get('sid').toString();const st=data.students.find(s=>s.id===sid);if(!st)return false;data.sessions.push({id:uid(),studentId:sid,studentName:st.name,date:today(),time:f.get('time').toString(),dur:+f.get('dur')||60,status:'scheduled'});save();modal=null;render();return false}
function fin(e){e.preventDefault();const f=new FormData(e.target);const id=modal.id;const att=f.get('att').toString();const se=data.sessions.find(s=>s.id===id);data.sessions=data.sessions.map(s=>s.id===id?{...s,status:'completed',attendance:att,homework:f.get('hw').toString()}:s);if(se&&(att==='Present'||att==='Late'))data.students=data.students.map(st=>st.id===se.studentId?{...st,remainingSessions:Math.max(0,st.remainingSessions-1)}:st);save();modal=null;render();return false}
function saveGr(e){e.preventDefault();const f=new FormData(e.target);const members=Array.from(e.target.members.selectedOptions).map(o=>o.value);const cap=+f.get('capacity')||6;if(members.length>cap){alert('عدد الأعضاء أكبر من السعة');return false}
const p={name:f.get('name').toString().trim(),subject:f.get('subject').toString().trim(),capacity:cap,memberIds:members,active:true};
if(modal.id){const old=data.groups.find(g=>g.id===modal.id);data.groups=data.groups.map(g=>g.id===modal.id?{...g,...p,active:old?old.active!==false:true}:g)}
else data.groups.unshift({id:uid(),...p});save();modal=null;render();return false}
function saveHw(e){e.preventDefault();const f=new FormData(e.target);const sid=f.get('sid').toString();const st=data.students.find(s=>s.id===sid);if(!st)return false;data.homework.unshift({id:uid(),studentId:sid,studentName:st.name,title:f.get('title').toString().trim(),due:f.get('due').toString(),status:'pending'});save();modal=null;render();return false}
function saveFn(e){e.preventDefault();const f=new FormData(e.target);data.finance.push({id:uid(),type:f.get('type').toString(),amount:+f.get('amount')||0,note:f.get('note').toString().trim(),date:f.get('date').toString()||today()});save();modal=null;render();return false}
