import {feedUrl,type Source} from './catalog.ts';
export async function fetchEnterprise(source:Source,fetchJson:(url:string,options?:any)=>Promise<any>){
 if(source.provider==='Amazon'){
  const jobs=new Map<string,any>();let offset=0;
  for(let page=0;page<200;page++){
   const body=await fetchJson(source.apiUrl+'&offset='+offset+'&result_limit=100');
   if(!Array.isArray(body.jobs)||typeof body.hits!=='number'||body.error)throw Error('Incomplete Amazon job feed');
   for(const row of body.jobs){const url=new URL(row.job_path,'https://www.amazon.jobs').href;const country=row.country_code==='IND'?'India':row.country_code;const posted=Date.parse(row.posted_date||'');jobs.set(String(row.id),{...row,jobUrl:url,applyUrl:row.url_next_step||url,location:[row.city,row.state,country].filter(Boolean).join(', '),description:(row.description||'')+'\n'+(row.basic_qualifications||''),updated_at:Number.isFinite(Date.parse(row.updated_time||''))?new Date(row.updated_time).toISOString():null,publishedAt:Number.isFinite(posted)?new Date(posted).toISOString():null});}
   offset+=body.jobs.length;if(offset>=body.hits)break;if(!body.jobs.length||page===199)throw Error('Incomplete Amazon pagination');
  }return {jobs:[...jobs.values()]};
 }
 if(source.provider==='Eightfold'){
  const jobs=new Map<string,any>();
  for(const keyword of ['data engineer','analytics engineer','etl','warehouse']){
   const url=source.apiUrl+'&query='+encodeURIComponent(keyword)+'&num=100';
   const first=await fetchJson(url+'&start=0');
   if(!Array.isArray(first.positions)||typeof first.count!=='number')throw Error('Incomplete Eightfold feed');
   const size=first.positions.length;if(!size&&first.count>0)throw Error('Empty partial Eightfold feed');
   const pages=size?Math.ceil(first.count/size):1;if(pages>200)throw Error('Eightfold pagination limit');
   const rows=[...first.positions];
   for(let page=1;page<pages;page+=4){const batch=await Promise.all(Array.from({length:Math.min(4,pages-page)},(_,i)=>fetchJson(url+'&start='+((page+i)*size))));for(const body of batch){if(!Array.isArray(body.positions)||!body.positions.length)throw Error('Incomplete Eightfold pagination');rows.push(...body.positions);}}
   if(new Set(rows.map((r:any)=>String(r.id))).size<first.count)throw Error('Incomplete or repeated Eightfold pages');
   for(const row of rows){if(!row.isPrivate)jobs.set(String(row.id),{...row,title:row.name,jobUrl:row.canonicalPositionUrl,applyUrl:row.canonicalPositionUrl,description:row.job_description||'',locationsText:row.locations?.join(' / ')||row.location,updated_at:row.t_update?new Date(row.t_update*1000).toISOString():null});}
  }return {jobs:[...jobs.values()]};
 }

 const jobs=new Map<string,any>();
 for(const keyword of ['data engineer','analytics engineer','etl','warehouse']){
  let offset=0;
  for(let page=0;page<200;page++){
   const body=source.provider==='Workday'?await fetchJson(feedUrl(source),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({appliedFacets:{},limit:20,offset,searchText:keyword})}):await fetchJson(feedUrl(source,offset)+'&q='+encodeURIComponent(keyword));
   const rows=source.provider==='Workday'?body.jobPostings:body.content;const total=source.provider==='Workday'?body.total:body.totalFound;
   if(!Array.isArray(rows)||typeof total!=='number')throw Error('Incomplete enterprise feed');
   for(const row of rows){const id=String(row.id||row.bulletFields?.[0]||row.externalPath);const url=source.provider==='Workday'?source.boardUrl+row.externalPath:'https://jobs.smartrecruiters.com/'+source.slug+'/'+(row.id||row.uuid);jobs.set(id,{...row,id,jobUrl:url,applyUrl:row.applyUrl||url});}
   offset+=rows.length;if(offset>=total)break;if(!rows.length||page===199)throw Error('Incomplete enterprise pagination');
  }
 }
 return {jobs:[...jobs.values()]};
}
