import {countryProfiles,type CountryProfile} from './data/country-mascots.ts';
import {companyCategory,type CompanyCategory} from './company-category.ts';
export {countryProfiles};
export type Expression='joy'|'laugh'|'confident'|'wave'|'friendly';
export const categoryExpressions:Record<CompanyCategory,{expression:Expression;label:string}>={
 'Product & technology':{expression:'joy',label:'Very joyful'},
 'IT services & consulting':{expression:'laugh',label:'Laughing'},
 'Banking & finance':{expression:'confident',label:'Confident smile'},
 'Real estate & operations':{expression:'wave',label:'Cheerful wave'},
 'Unclassified':{expression:'friendly',label:'Friendly smile'}
};
export function employerExpression(company:string){return categoryExpressions[companyCategory(company)];}
const clean=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const byCode=new Map(countryProfiles.map(c=>[c.code,c]));
const extra:Record<string,string[]>={IN:['bharat','bengaluru','bangalore','hyderabad','mumbai','pune','chennai','gurugram','gurgaon','noida','new delhi','kolkata','coimbatore','kochi','ahmedabad','visakhapatnam','thiruvananthapuram'],US:['usa','u s a','united states of america','new york','san francisco','seattle','austin','boston','chicago','san jose'],GB:['uk','u k','great britain','england','scotland','wales','northern ireland','london','manchester','edinburgh'],CA:['toronto','vancouver','montreal','ottawa'],AU:['sydney','melbourne','brisbane','perth'],DE:['berlin','munich','frankfurt','hamburg'],FR:['paris','lyon'],JP:['tokyo','osaka'],AE:['uae','u a e','dubai','abu dhabi'],NL:['amsterdam','rotterdam'],IE:['dublin'],NZ:['auckland','wellington'],SG:['singapore'],KR:['seoul','republic of korea'],CN:['beijing','shanghai','shenzhen'],BR:['sao paulo'],PL:['warsaw','krakow'],ES:['madrid','barcelona'],SE:['stockholm'],FI:['helsinki'],CH:['zurich','geneva'],PT:['lisbon','porto'],ZA:['cape town','johannesburg'],IL:['tel aviv'],TW:['taipei'],CZ:['prague','czech republic']};
const aliases=countryProfiles.flatMap(c=>[...c.aliases,...(extra[c.code]||[])].map(alias=>({text:clean(alias),code:c.code}))).filter(a=>a.text.length>=4||['uk','usa','uae'].includes(a.text)).sort((a,b)=>b.text.length-a.text.length);
// Match locations only. Longer country names win over a shorter overlapping name (e.g. Guinea).
export function locationCountries(location:string):CountryProfile[]{
 const value=' '+clean(location||'')+' ';if(/\b(worldwide|global|anywhere)\b/.test(value))return [];
 const found=new Set<string>();let remaining=value;
 for(const alias of aliases){const needle=' '+alias.text+' ';if(remaining.includes(needle)){found.add(alias.code);remaining=remaining.split(needle).join(' ');}}
 // Common explicit US abbreviations are accepted; ambiguous two-letter codes such as CA are not guessed.
 if(/(?:^|[,;\s(])U\.?S\.?(?:$|[,;\s)])/i.test(location||''))found.add('US');
 return [...found].map(c=>byCode.get(c)!).filter(Boolean);
}
export function jobCountry(location:string){const countries=locationCountries(location);return countries.length===1?countries[0]:null;}
export function countryLabel(location:string){const countries=locationCountries(location);return countries.length===1?countries[0].name:countries.length>1?'Multiple countries':'Worldwide / location unspecified';}
export function animalName(country:CountryProfile|null){return country?.animal||'Atlas fox';}
export function animalStatus(country:CountryProfile|null){return country?.animal?(country.group==='bird'?'National bird / animal symbol':country.status==='official'?'Designated national animal / symbol':'Traditional animal symbol'):'Original mascot · national animal not verified';}
export function animalStyle(country:CountryProfile|null){
 const a=(country?.animal||'fox').toLowerCase();
 if(country?.group==='bird')return /eagle|falcon|condor/.test(a)?'eagle':/rooster|junglefowl/.test(a)?'rooster':/kiwi/.test(a)?'kiwi':/swan/.test(a)?'swan':'bird';
 for(const kind of ['tiger','panda','beaver','kangaroo','elephant','lion','bear','wolf','zebra','giraffe','camel','tapir','hare','leopard','dragon'])if(a.includes(kind))return kind;
 if(/oryx|gemsbok|springbok|markhor|antelope|huemul|deer|takin/.test(a))return 'antelope';
 if(/buffalo|bison|bull|kouprey|zebu/.test(a))return 'buffalo';
 if(/vicuna|vicuña/.test(a))return 'llama';
 if(/okapi/.test(a))return 'okapi';
 if(/marten/.test(a))return 'marten';
 return 'fox';
}
