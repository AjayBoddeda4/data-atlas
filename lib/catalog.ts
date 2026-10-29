import {employerPostingDate} from './posting-date.ts';
import {explicitlyClosed,hasExpired} from './job-availability.ts';
export type Source={id:string;name:string;provider:string;slug:string;boardUrl?:string;apiUrl?:string;scope?:string;region?:string};
export type Job={id:string;title:string;company:string;location:string;url:string;applyUrl:string;source:string;checkedAt:string;updatedAt:string|null;publishedAt:string|null;discoveredAt?:string;postingDateText?:string|null;postingDateEstimated?:boolean;validThrough?:string|null;description:string;remote:boolean;experience:{min:number|null;evidence:string[]};provider:string};
export type Snapshot={source:string;name:string;status:string;checkedAt:string|null;attemptedAt?:string;error?:string;stale?:boolean;jobs:Job[];totalBoardJobs?:number;removedCount?:number;confirmedClosedUrls?:string[];closureCursor?:number;closureChecks?:number};
export const matches=(title:string)=> {
 const direct=/\b(?:data|analytics|etl|elt|big[ -]?data|data[ -]?warehouse|data[ -]?platform|data[ -]?pipeline)[^\n]{0,45}\b(?:engineer|engineering|developer|architect)\b|\b(?:engineer|engineering|developer|architect)[^\n]{0,70}\b(?:data|analytics|etl|elt|warehouse)\b|ingénieur.*donn|dateningenieur|engenheir.*dados|ingenier.*datos/i.test(title);
 return direct&&!/data cent(?:er|re)|data annotat|sales engineer|solutions engineer|data scien(?:tist|ce)/i.test(title);
};
export function plain(input:string){return String(input||'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/<\/(?:p|li|div|h[1-6])>/gi,'\n').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&#39;|&apos;/g,"'").replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n\n').trim();}
export function experience(description:string){
 const lines=plain(description).split(/[\n;]+/).filter(s=>s.length<1500&&!/preferred|nice.to.have|bonus|ideally|desirable/i.test(s));
 const found:{n:number;line:string}[]=[];
 for(const line of lines){const re=/(\d{1,2})\s*(?:\+|(?:-|–|to)\s*\d{1,2})?\s*(?:years?|yrs?)\b[^.!?\n]{0,90}\bexperience\b/gi;for(const m of line.matchAll(re)){const n=Number(m[1]);if(n<=30)found.push({n,line:line.trim().slice(0,500)});}}
 return {min:found.length?Math.max(...found.map(x=>x.n)):null,evidence:[...new Set(found.map(x=>x.line))].slice(0,4)};
}
export function feedUrl(s:Source,skip=0){return s.provider==='SmartRecruiters'?`https://api.smartrecruiters.com/v1/companies/${s.slug}/postings?limit=100&offset=${skip}`:s.provider==='Workday'?s.apiUrl||'': s.provider==='Greenhouse'?`https://boards-api.greenhouse.io/v1/boards/${s.slug}/jobs?content=true`:s.provider==='Ashby'?`https://api.ashbyhq.com/posting-api/job-board/${s.slug}`:`https://${s.region==='EU'?'api.eu.lever.co':'api.lever.co'}/v0/postings/${s.slug}?mode=json&limit=100&skip=${skip}`;}
const safe=(url:any)=>typeof url==='string'&&/^https:\/\//.test(url)?url:'';
export function normalize(s:Source,body:any,checkedAt:string):Snapshot{
 const enterprise=s.provider==='Workday'||s.provider==='SmartRecruiters'||s.provider==='Eightfold'||s.provider==='Amazon';
 const rows=enterprise?body.jobs:s.provider==='Lever'?body:body.jobs;
 if(!Array.isArray(rows)||rows.some((x:any)=>!x||typeof (x.title||x.text||x.name)!=='string'))throw Error('Incomplete or unexpected source response');
 const jobs=rows.filter((j:any)=>!explicitlyClosed(j,Date.parse(checkedAt))&&matches(j.title||j.text||j.name)).map((j:any)=>{
 const description=plain(enterprise?(j.description||Object.values(j.jobAd?.sections||{}).map((section:any)=>section.text).join('\n')):s.provider==='Greenhouse'?j.content:s.provider==='Ashby'?j.descriptionPlain||j.descriptionHtml:[j.descriptionPlain||j.description,...(j.lists||[]).map((x:any)=>x.text+'\n'+x.content),j.additionalPlain||j.additional].join('\n'));
 const url=safe(j.absolute_url||j.jobUrl||j.hostedUrl||j.applyUrl);const title=j.title||j.text||j.name;
 return {id:s.id+':'+j.id,title,company:s.name,location:(typeof j.location==='string'?j.location:j.location?.name)||j.locationsText||(enterprise?[j.location?.city,j.location?.region,j.location?.country].filter(Boolean).join(', '):'')||j.categories?.location||'Not specified',url,applyUrl:safe(j.applyUrl)||url,source:s.id,checkedAt,discoveredAt:checkedAt,updatedAt:j.updated_at||null,...employerPostingDate(j,checkedAt),validThrough:j.validThrough||j.expiresAt||null,description,remote:!!j.isRemote||j.workplaceType==='remote'||/remote|home based|anywhere/i.test(j.location?.name||(typeof j.location==='string'?j.location:'')||j.locationsText||j.categories?.location||''),experience:experience(description),provider:s.provider};
 }).filter((j:Job)=>j.url&&j.applyUrl);
 return {source:s.id,name:s.name,status:'ok',checkedAt,attemptedAt:checkedAt,jobs,totalBoardJobs:rows.length};
}
export function reconcile(previous:Snapshot|null,current:Snapshot):Snapshot{
 if(current.status!=='ok')return {...current,checkedAt:previous?.checkedAt||null,jobs:(previous?.jobs||[]).filter(j=>!hasExpired(j.validThrough)),stale:true};
 const oldByUrl=new Map((previous?.jobs||[]).map(j=>[j.url,j]));current={...current,jobs:current.jobs.map(j=>{const old=oldByUrl.get(j.url);j={...j,discoveredAt:old?old.discoveredAt:j.discoveredAt};return old?.publishedAt&&(!j.publishedAt||!old.postingDateEstimated&&j.postingDateEstimated)?{...j,publishedAt:old.publishedAt,postingDateText:old.postingDateText,postingDateEstimated:old.postingDateEstimated}:j;})};
 const ids=new Set(current.jobs.map(j=>j.id));return {...current,stale:false,removedCount:(previous?.jobs||[]).filter(j=>!ids.has(j.id)).length};
}
export function companyKey(s:string){return s.toLowerCase().replace(/\b(incorporated|inc|llc|ltd|limited|corporation|corp)\b/g,'').replace(/[^a-z0-9]/g,'');}
export function parseConnections(csv:string){
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false;
 for(let i=0;i<csv.length;i++){const c=csv[i];if(c==='"'){if(quoted&&csv[i+1]==='"'){cell+='"';i++}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell=''}else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));rows.push(row);row=[];cell=''}else cell+=c;}if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}
 const h=rows.findIndex(r=>r.some(c=>c.trim()==='First Name')&&r.some(c=>c.trim()==='Company'));if(h<0)throw Error('Choose the Connections.csv file from your LinkedIn export (First Name and Company columns required).');
 const header=rows[h].map(x=>x.trim());const val=(r:string[],k:string)=>r[header.indexOf(k)]?.trim()||'';
 return rows.slice(h+1).map(r=>({name:[val(r,'First Name'),val(r,'Last Name')].filter(Boolean).join(' '),company:val(r,'Company'),position:val(r,'Position'),url:/^https:\/\/(www\.)?linkedin\.com\/in\//i.test(val(r,'URL'))?val(r,'URL'):''})).filter(r=>r.name&&r.company);
}

export function locationMatches(actual:string,query:string){const q=query.trim().toLowerCase();return !q||actual.toLowerCase().includes(q)||(q==='india'&&/\b(?:bengaluru|bangalore|hyderabad|pune|mumbai|chennai|gurugram|gurgaon|noida|new delhi|kolkata|ahmedabad|kochi|coimbatore|indore|jaipur)\b/i.test(actual));}

const employerAliases:Record<string,string>={clairvoyant:'exlclairvoyant',exl:'exlclairvoyant',facebook:'meta',metafacebook:'meta',alphabet:'google',tataconsultancyservices:'tcs',ltm:'ltimindtree'};
export function employerKey(value:string){const key=companyKey(value);return employerAliases[key]||key;}
export function companyMatches(actual:string,filter:string){return !filter||employerKey(actual)===employerKey(filter);}
export function roleSearchMatches(job:Pick<Job,'title'|'company'>,query:string){const q=query.trim().toLowerCase();if(!q)return true;if(q==='maang'||q==='faang')return ['meta','amazon','apple','netflix','google'].includes(employerKey(job.company));return (job.title+' '+job.company).toLowerCase().includes(q)||!!companyKey(q)&&employerKey(job.company).includes(employerKey(q));}
