// Filesystem-safe, deterministic URLs shared by the UI and static exporter.
export function jobPath(id:string){return 'jobs/'+encodeURIComponent(id).replace(/~/g,'%7E').replace(/%/g,'~')+'/';}
