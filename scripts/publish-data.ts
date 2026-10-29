import {mkdir,writeFile} from 'node:fs/promises';
import {getState} from '../server/store.ts';
import {hasExpired} from '../lib/job-availability.ts';
export async function publishedData(){const state=await getState();const index=Object.fromEntries(Object.entries(state.snapshots).map(([id,s])=>[id,{...s,jobs:s.jobs.filter(j=>!hasExpired(j.validThrough)).map(j=>({...j,description:''}))}]));return {index,found:state.found.filter(p=>!hasExpired(p.job.validThrough)),'latest-run':state.latestRun,scan:{id:state.latestRun.id+':'+state.latestRun.checks.length+':'+(state.latestRun.finishedAt||state.latestRun.checks.at(-1)?.finishedAt||''),generatedAt:new Date().toISOString(),checked:state.latestRun.checks.length,cursor:state.cursor}};}
if(import.meta.url===new URL(process.argv[1],'file:').href){await mkdir('public/data',{recursive:true});for(const [name,value]of Object.entries(await publishedData()))await writeFile('public/data/'+name+'.json',JSON.stringify(value));}
