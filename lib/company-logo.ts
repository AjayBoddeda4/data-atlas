import {companyKey} from './catalog.ts';
import logos from './company-logos.json';
const byCompany=new Map(logos.flatMap(row=>row.names.map(name=>[companyKey(name),row] as const)));
export function companyLogo(company:string){return byCompany.get(companyKey(company))||null;}
export function companyInitials(company:string){return company.normalize('NFKC').trim().split(/[\s._-]+/).filter(word=>word!=='&').slice(0,2).map(word=>Array.from(word)[0]).join('').toUpperCase()||'?';}

export function companyHue(company:string){let hash=0;for(const char of companyKey(company)||company)hash=(hash*31+char.charCodeAt(0))>>>0;return [207,220,244,266,182,160][hash%6];}
