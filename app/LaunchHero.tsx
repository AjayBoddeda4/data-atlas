'use client';
import {useEffect,useState} from 'react';
import DataPipelineVisual from './DataPipelineVisual';
export default function LaunchHero({successfulFeeds,totalFeeds,busy,onTrigger,depth,liveScanning=true}:{successfulFeeds:number;totalFeeds:number;busy:boolean;onTrigger:()=>void;depth:boolean;liveScanning?:boolean}){
 const [guide,setGuide]=useState(true),[motionAllowed,setMotionAllowed]=useState(false);
 useEffect(()=>{try{setGuide(localStorage.getItem('atlas-trigger-guide-v1')!=='seen');}catch{}},[]);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setMotionAllowed(!media.matches&&!(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);

 function dismiss(){setGuide(false);try{localStorage.setItem('atlas-trigger-guide-v1','seen');}catch{}}
 function trigger(){dismiss();onTrigger();}
 const ratio=totalFeeds?Math.min(100,Math.max(0,successfulFeeds/totalFeeds*100)):0;
 return <section className={'launch-experience '+(!depth||!motionAllowed?'launch-motion-off':'')} aria-label="Start your job search">
 <div className="launch-coverage"><span className="coverage-emblem" aria-hidden="true">◎</span><div><span className="launch-overline">FEEDS SUCCESSFULLY INDEXED</span><p><strong>{successfulFeeds.toLocaleString('en-IN')}</strong><span>of <b>{totalFeeds.toLocaleString('en-IN')}</b> tracked sites</span></p></div><div className="launch-coverage-progress"><div role="meter" aria-label="Shared feed indexing coverage" aria-valuemin={0} aria-valuemax={totalFeeds} aria-valuenow={successfulFeeds}><span style={{width:ratio+'%'}}/></div><small>{liveScanning?'Shared index · scan progress starts when you trigger':'Opportunities from company career sites'}</small></div>{liveScanning&&<button onClick={trigger} disabled={busy}>{busy?'Checking feeds…':liveScanning?'↻ Trigger now':'↻ Check updates'}</button>}</div>
 <div className="launch-hero"><div className="launch-copy"><span className="eyebrow">INDIA FIRST. OPPORTUNITIES EVERYWHERE.</span><h1>Your next role.<br/><em>A world of data jobs.</em></h1><p>Explore data engineering roles, filter your experience, and apply directly on company websites.</p><div className="launch-actions">{liveScanning?<button onClick={trigger} disabled={busy}>{busy?'↻ Checking career sites…':'↻ Trigger now — get new jobs'}</button>:<a className="hero-explore" href="#job-results">Explore data jobs <span>↗</span></a>}{liveScanning&&<a href="#job-results">Explore jobs <span>↗</span></a>}</div><small>{liveScanning?'Click Trigger now to check tracked career sites for new postings.':'Search by experience, location and employer posting date.'}</small></div>
 <DataPipelineVisual enabled={depth&&motionAllowed} busy={busy}/></div>
 {guide&&liveScanning&&<div className="first-trigger-guide" role="region" aria-label="First visit guide"><span className="guide-step" aria-hidden="true">01</span><div><h2>New here? Start with {liveScanning?'Trigger now':'Check updates'}.</h2><p>{liveScanning?'The jobs you see are already in the shared index. Click Trigger now above to check career sites for new openings. Keep this page open; you can search while it runs.':'Existing jobs load immediately. Check updates loads the latest published results; Run scan in GitHub starts a fresh scan.'}</p></div><button onClick={dismiss}>Got it <span aria-hidden="true">✓</span></button></div>}
 </section>;
}
