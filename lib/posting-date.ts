export type PostingDate={publishedAt:string|null;postingDateText?:string|null;postingDateEstimated?:boolean};
const valid=(value:unknown)=>typeof value==='string'&&value.trim()&&Number.isFinite(Date.parse(value));
export function parsePostingDate(raw:unknown,checkedAt:string):PostingDate{
 if(typeof raw==='number'&&Number.isFinite(raw)){const ms=raw<1e12?raw*1000:raw;if(ms>946684800000&&ms<4102444800000)return {publishedAt:new Date(ms).toISOString(),postingDateText:null,postingDateEstimated:false};}
 if(typeof raw!=='string'||!raw.trim())return {publishedAt:null,postingDateText:null,postingDateEstimated:false};
 const text=raw.trim();if(/\b(?:today|yesterday|\d+\+?\s+(?:days?|hours?|minutes?|weeks?|months?)\s+ago)\b/i.test(text)){
 const reference=Date.parse(checkedAt);if(!Number.isFinite(reference))return {publishedAt:null,postingDateText:text,postingDateEstimated:true};
 const base=new Date(dayKey(reference)+'T00:00:00Z');
 const days=/\b(\d+)\s+days?\s+ago\b/i.exec(text);
 if(/\btoday\b/i.test(text))return {publishedAt:base.toISOString().slice(0,10),postingDateText:text,postingDateEstimated:true};
 if(/\byesterday\b/i.test(text))base.setUTCDate(base.getUTCDate()-1);
 else if(days)base.setUTCDate(base.getUTCDate()-Number(days[1]));
 else return {publishedAt:null,postingDateText:text,postingDateEstimated:true};
 return {publishedAt:base.toISOString().slice(0,10),postingDateText:text,postingDateEstimated:true};
 }
 return valid(text)?{publishedAt:/^\d{4}-\d{2}-\d{2}$/.test(text)?text:new Date(text).toISOString(),postingDateText:null,postingDateEstimated:false}:{publishedAt:null,postingDateText:text,postingDateEstimated:false};
}
export function employerPostingDate(row:any,checkedAt:string):PostingDate{let fallback:PostingDate|undefined;for(const raw of [row.publishedAt,row.datePosted,row.releasedDate,row.firstPublishedAt,row.postedOn,row.postingDate]){const result=parsePostingDate(raw,checkedAt);if(result.publishedAt)return result;if(result.postingDateText&&!fallback)fallback=result;}return fallback||{publishedAt:null,postingDateText:null,postingDateEstimated:false};}
export function postingTimestamp(job:PostingDate){const timestamp=Date.parse(job.publishedAt||'');return Number.isFinite(timestamp)?timestamp:0;}
const zone='Asia/Kolkata';
const dayFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});
const labelFormatter=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:zone});
function dayKey(ms:number){const parts=dayFormatter.formatToParts(new Date(ms));const field=(type:string)=>parts.find(p=>p.type===type)?.value;return `${field('year')}-${field('month')}-${field('day')}`;}
export function matchesPostingDate(job:PostingDate,filter:string|undefined,now=Date.now()){
 if(!filter||filter==='All dates')return true;const timestamp=postingTimestamp(job);if(filter==='Date not supplied')return !timestamp;if(!timestamp)return false;
 const posted=/^\d{4}-\d{2}-\d{2}$/.test(job.publishedAt||'')?job.publishedAt!:dayKey(timestamp),today=dayKey(now);if(filter==='Posted today')return posted===today;
 const days=filter==='Past 7 days'?6:filter==='Past 30 days'?29:null;if(days==null)return true;return posted<=today&&posted>=dayKey(now-days*86400000);
}
export function postingDateLabel(job:PostingDate){if(!postingTimestamp(job))return job.postingDateText?`Employer date: ${job.postingDateText} · exact date unavailable`:'Employer posting date not supplied';const date=labelFormatter.format(new Date(job.publishedAt!));return `Posted ${job.postingDateEstimated?'approximately ':''}${date}${job.postingDateText?' · '+job.postingDateText:''}`;}
