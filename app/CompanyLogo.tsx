'use client';
import {useState,type CSSProperties} from 'react';
import {companyLogo,companyInitials,companyHue} from '../lib/company-logo';
import {publicAsset} from '../lib/public-asset';
export default function CompanyLogo({company,featured=false,compact=false}:{company:string;featured?:boolean;compact?:boolean}){
 const [failed,setFailed]=useState('');const logo=companyLogo(company),src=logo?publicAsset('company-logos/'+logo.file):'';const show=!!src&&failed!==src;
 return <span className={(featured?'employer-monogram ':'companyicon ')+(show?'official-company-logo':'company-logo-fallback')+(compact?' company-logo-compact':'')} style={{'--company-hue':companyHue(company)} as CSSProperties} title={show?company+' logo':company+' · initials icon'}>
 {show?<img src={src} width={40} height={40} alt={company+' logo'} loading="lazy" decoding="async" onError={()=>setFailed(src)}/>:<span className="company-monogram" role="img" aria-label={company+' initials icon'}>{companyInitials(company)}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V8l8-4 8 4v12M8 20v-7h8v7M8 9v1m4-3v3m4-1v1"/></svg></span>}
 </span>;
}
