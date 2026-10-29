'use client';
import {createPortal} from 'react-dom';
import CountryMascot from './CountryMascot';
import {companyCategory} from '../lib/company-category';
import {animalName,jobCountry,countryLabel,employerExpression} from '../lib/country-mascot';
import {postingDateLabel} from '../lib/posting-date';
import type {AuditJob} from '../lib/refresh-audit';
export type PocketNotice={job:AuditJob;count:number;key:string;discoveredAt?:string;availability?:string};
export default function PocketDiscovery({notice,onView,onDismiss,pending=0,onNext}:{notice:PocketNotice;onView:()=>void;onDismiss:()=>void;pending?:number;onNext?:()=>void}){
 const country=jobCountry(notice.job.location),character=animalName(country),category=companyCategory(notice.job.company),mood=employerExpression(notice.job.company);
 return createPortal(<aside className="pocket-discovery animal-discovery" aria-label={character+' found a job'} key={notice.key}><button className="pocket-close" onClick={onDismiss} aria-label="Dismiss job discovery">×</button><div className="doraemon-stage" aria-hidden="true"><CountryMascot country={country} expression={mood.expression}/><div className="pocket-paper"><span>✦ JOB FOUND</span><b>{notice.job.title}</b><i>View application →</i></div></div><div className="pocket-message" role="status"><span className="eyebrow">{countryLabel(notice.job.location).toUpperCase()} · JOB DISCOVERY</span><span className="character-category">{character} · {category} · {mood.label}</span><h3>{notice.job.title}</h3><p>{notice.job.company} · {notice.job.location}</p><small className="pocket-discovered">{notice.discoveredAt?'Discovered '+new Date(notice.discoveredAt).toLocaleString():'New to this device'}{notice.availability&&notice.availability!=='ok'?' · availability unverified':''}</small><small className="pocket-posted">{postingDateLabel(notice.job)}</small>{notice.count>1&&<small>{notice.count} roles discovered in this source check</small>}<button className="pocket-view" onClick={onView}>Highlight in found postings →</button>{pending>0&&<button className="pocket-next" onClick={onNext}>Next discovery · {pending} waiting →</button>}<a href={notice.job.applyUrl||notice.job.url} target="_blank" rel="noreferrer">Apply on official site ↗</a></div></aside>,document.body);
}
