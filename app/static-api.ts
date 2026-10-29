import {sharedDiscoveries} from '../lib/shared-discoveries';
import {localMode} from './runtime';
import {searchCatalog} from '../lib/search-catalog';
import {directory} from '../lib/directory';
import {sources} from '../lib/sources';
let index:Record<string,any>={};
export function setIndex(value:Record<string,any>){index=value;}
export async function atlasFetch(input:string,options?:RequestInit){if(localMode)return window.fetch(input,input.startsWith('/api/jobs')?{...options,method:'POST'}:options);const url=new URL(input,window.location.href);if(url.pathname.endsWith('/api/discoveries')){const body=JSON.parse(String(options?.body||'{}'));return Response.json({...sharedDiscoveries(index,sources,body.known||[]),syncing:false});}if(url.pathname.endsWith('/api/search')){const filters=JSON.parse(String(options?.body||'{}'));return Response.json({...searchCatalog(index,filters,sources.length),syncing:false});}if(url.pathname.endsWith('/api/directory'))return Response.json(directory(index,url.searchParams));if(url.pathname.endsWith('/api/jobs'))return Response.json({error:'GitHub Pages cannot run server checks. Use Run scan in GitHub.'},{status:503});return window.fetch(input,options);}
