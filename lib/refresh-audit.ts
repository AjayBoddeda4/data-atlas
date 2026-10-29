import type {Source,Snapshot,Job} from './catalog';
export type RequestEvidence={url:string;status:number|null;finishedAt:string;durationMs:number;error?:string};
export type AuditJob=Pick<Job,'id'|'title'|'company'|'location'|'url'|'applyUrl'|'publishedAt'|'updatedAt'|'provider'|'validThrough'|'postingDateText'|'postingDateEstimated'|'discoveredAt'>;
export type RefreshAudit={id:string;source:string;name:string;provider:string;boardUrl:string|null;status:string;startedAt:string;finishedAt:string;durationMs:number;previousCheckedAt:string|null;baseline:boolean;previousCount:number;currentCount:number;observedCount:number;newJobs:AuditJob[];listedJobs?:AuditJob[];closedUrls?:string[];closureChecks?:number;updatedCount:number;removedCount:number;message:string;requests:RequestEvidence[]};
export const compact=(j:Job):AuditJob=>({id:j.id,title:j.title,company:j.company,location:j.location,url:j.url,applyUrl:j.applyUrl,publishedAt:j.publishedAt,discoveredAt:j.discoveredAt,postingDateText:j.postingDateText,postingDateEstimated:j.postingDateEstimated,updatedAt:j.updatedAt,validThrough:j.validThrough,provider:j.provider});
export function buildRefreshAudit(source:Source,previous:Snapshot|null,current:Snapshot,startedAt:string,requests:RequestEvidence[],finishedAt=new Date().toISOString()):RefreshAudit{
 const baseline=!!previous?.checkedAt;const before=previous?.jobs||[];
 const priorById=new Map(before.map(j=>[j.id,j])),priorByUrl=new Map(before.map(j=>[j.url,j]));
 const successful=current.status==='ok'||current.status==='limited';
 // Limited checks retain old rows; only rows observed in this request can be discoveries or updates.
 const observed=successful?current.jobs.filter(j=>current.status==='ok'||j.checkedAt===current.checkedAt):[];
 const newlyFound=observed.filter(j=>!priorById.has(j.id)&&!priorByUrl.has(j.url));
 const updated=observed.filter(j=>{const old=priorById.get(j.id)||priorByUrl.get(j.url);return old&&JSON.stringify(compact(old))!==JSON.stringify(compact(j));});
 const currentIds=new Set(current.jobs.map(j=>j.id)),currentUrls=new Set(current.jobs.map(j=>j.url));
 return {id:source.id,source:source.id,name:source.name,provider:source.provider,boardUrl:source.boardUrl||null,status:current.status,startedAt,finishedAt,durationMs:Math.max(0,Date.parse(finishedAt)-Date.parse(startedAt)),previousCheckedAt:previous?.checkedAt||null,baseline,previousCount:before.length,currentCount:current.jobs.length,observedCount:observed.length,newJobs:newlyFound.map(compact),listedJobs:observed.map(compact),closedUrls:current.confirmedClosedUrls||[],closureChecks:current.closureChecks||0,updatedCount:updated.length,removedCount:current.status==='ok'?before.filter(j=>!currentIds.has(j.id)&&!currentUrls.has(j.url)).length:current.removedCount||0,message:current.error||(current.status==='ok'?'Feed fetched and compared with the previous stored snapshot.':'Check incomplete; prior listings retained.'),requests};
}
