import type {Snapshot,Source} from './catalog';
import {hasExpired} from './job-availability.ts';
import {compact} from './refresh-audit.ts';
import type {FoundPosting} from './found-postings';
export type KnownDiscovery={id:string;source:string;url:string;lastCheckedAt:string};
export function sharedDiscoveries(records:Record<string,Snapshot>,sources:Source[],known:KnownDiscovery[]=[],now=Date.now()){
 const sourceMap=new Map(sources.map(s=>[s.id,s]));const discoveries:FoundPosting[]=[];
 for(const snapshot of Object.values(records))for(const job of snapshot.jobs||[]){if(!job.discoveredAt||hasExpired(job.validThrough,now))continue;discoveries.push({id:job.source+'|'+job.url,source:job.source,job:compact(job),discoveredAt:job.discoveredAt,lastCheckedAt:snapshot.attemptedAt||snapshot.checkedAt||job.checkedAt,status:snapshot.status,boardUrl:sourceMap.get(job.source)?.boardUrl||null});}
 discoveries.sort((a,b)=>b.discoveredAt.localeCompare(a.discoveredAt)||a.id.localeCompare(b.id));
 const retired=known.filter(k=>{const s=records[k.source];const checked=Date.parse(s?.attemptedAt||s?.checkedAt||''),previous=Date.parse(k.lastCheckedAt);if(!s||!Number.isFinite(checked)||!Number.isFinite(previous)||checked<previous)return false;return (s.confirmedClosedUrls||[]).includes(k.url)||s.status==='ok'&&!s.jobs.some(j=>j.url===k.url);}).map(k=>k.id);
 return {discoveries:discoveries.slice(0,500),retired,truncated:discoveries.length>500,total:discoveries.length,syncedAt:new Date(now).toISOString()};
}
