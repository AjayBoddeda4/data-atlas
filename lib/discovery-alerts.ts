import {hasExpired} from './job-availability.ts';
import type {RefreshAudit} from './refresh-audit';
import type {AuditJob} from './refresh-audit';
export function discoveryKey(job:AuditJob,discoveredAt?:string){return job.id+'@'+(job.discoveredAt||discoveredAt||'unknown');}
export function takeUnseen<T extends {key:string}>(incoming:T[],seen:Set<string>,limit=30){const fresh:T[]=[];for(const item of incoming){if(!seen.has(item.key)){seen.add(item.key);fresh.push(item);}}return fresh.slice(0,limit);}
export function storedSeen(seen:Set<string>){return [...seen].slice(-2000);}
// A new browser starts with a silent history baseline. Discovery time, not posting time,
// determines whether a later sync can notify. Always remember historical keys too.
export function takeRecentUnseen<T extends {key:string;discoveredAt?:string;job?:{discoveredAt?:string}}>(incoming:T[],seen:Set<string>,startedAt:number,limit=30){
 const fresh:T[]=[];for(const item of incoming){if(seen.has(item.key))continue;seen.add(item.key);const time=Date.parse(item.job?.discoveredAt||item.discoveredAt||'');if(Number.isFinite(time)&&time>=startedAt)fresh.push(item);}return fresh.slice(0,limit);
}
export function alertStart(raw:string|null,now:number){const value=Number(raw);return raw&&Number.isFinite(value)&&value>0&&value<=now?value:now;}
export function auditNotices(audit:RefreshAudit){
 if(audit.status!=='ok'&&audit.status!=='limited')return [];
 return audit.newJobs.filter(job=>!hasExpired(job.validThrough)).map(job=>({job,count:audit.newJobs.length,key:discoveryKey(job,audit.finishedAt),discoveredAt:job.discoveredAt||audit.finishedAt,availability:audit.status}));
}
export function restorePending<T extends {key:string}>(raw:string|null):T[]{try{const rows=JSON.parse(raw||'[]');if(!Array.isArray(rows))return [];const seen=new Set<string>();return rows.filter(row=>row&&typeof row.key==='string'&&row.job&&typeof row.job.id==='string'&&typeof row.job.company==='string'&&typeof row.job.title==='string'&&typeof row.job.url==='string'&&/^https:\/\//.test(row.job.url)&&!hasExpired(row.job.validThrough)&&!seen.has(row.key)&&(seen.add(row.key),true)).slice(0,500);}catch{return [];}}

export function pruneNotices<T extends {job:AuditJob}>(notices:T[],audit:RefreshAudit){const closed=new Set(audit.closedUrls||[]),listed=audit.listedJobs?new Set(audit.listedJobs.map(j=>j.url)):null;return notices.filter(n=>!hasExpired(n.job.validThrough)&&!closed.has(n.job.url)&&(!n.job.id.startsWith(audit.source+':')||audit.status!=='ok'||!listed||listed.has(n.job.url)));}
