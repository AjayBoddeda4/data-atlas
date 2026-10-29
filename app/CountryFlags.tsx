import {locationCountries} from '../lib/country-mascot';
import {publicAsset} from '../lib/public-asset';
export default function CountryFlags({location,prominent=false}:{location:string;prominent?:boolean}){
 const countries=locationCountries(location);
 return <div className={'discovery-flags'+(prominent?' mascot-flags':'')} aria-label={countries.length?'Job location countries':'Worldwide or location unspecified'}>
 {countries.length?countries.map(country=><span key={country.code} title={country.name}><img src={publicAsset('country-flags/'+country.code.toLowerCase()+'.svg')} width={36} height={27} alt={country.name+' flag'}/>{!prominent&&<b>{country.name}</b>}</span>):<span><span role="img" aria-label="Worldwide">🌐</span>{!prominent&&<b>Location not specified / worldwide</b>}</span>}
 </div>;
}
