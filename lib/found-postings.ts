import {hasExpired} from './job-availability.ts';
import type {AuditJob,RefreshAudit} from './refresh-audit';
export type FoundPosting={id:string;job:AuditJob;source:string;discoveredAt:string;lastCheckedAt:string;status:string;boardUrl:string|null};
export function updateFoundPostings(previous:FoundPosting[],audit:RefreshAudit):FoundPosting[]{
 const closed=new Set(audit.closedUrls||[]);const listed=audit.listedJobs;const byUrl=new Map((listed||[]).map(j=>[j.url,j]));
 const next=previous.filter(p=>!hasExpired(p.job.validThrough)&&(p.source!==audit.source||!closed.has(p.job.url)&&(audit.status!=='ok'||!listed||byUrl.has(p.job.url)))).map(p=>p.source!==audit.source?p:{...p,job:byUrl.get(p.job.url)||p.job,lastCheckedAt:audit.finishedAt,status:audit.status,boardUrl:audit.boardUrl});
 const existing=new Set(next.map(p=>p.source+'|'+p.job.url));
 if(audit.status==='ok'||audit.status==='limited')for(const job of audit.newJobs){const key=audit.source+'|'+job.url;if(!hasExpired(job.validThrough)&&!closed.has(job.url)&&!existing.has(key)){next.push({id:key,job,source:audit.source,discoveredAt:audit.finishedAt,lastCheckedAt:audit.finishedAt,status:audit.status,boardUrl:audit.boardUrl});existing.add(key);}}
 return next;
}
export function isPresent(p:FoundPosting,now:number){return p.status==='ok'&&now-Date.parse(p.lastCheckedAt)<86400000;}
