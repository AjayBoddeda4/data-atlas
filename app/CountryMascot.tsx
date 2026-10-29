'use client';
import {animalName,animalStyle,animalStatus,type Expression} from '../lib/country-mascot';
import type {CountryProfile} from '../lib/data/country-mascots';
export function CountryMap({country}:{country:CountryProfile|null}){
 return <svg viewBox="0 0 100 100" className="mascot-country-map" aria-hidden="true">{country?.map?<path d={country.map}/>:<><circle cx="50" cy="50" r="40"/><ellipse cx="50" cy="50" rx="19" ry="40"/><path d="M12 36H88M10 59H90M50 10V90"/>{country&&<circle cx={10+(country.latlng[1]+180)/360*80} cy={90-(country.latlng[0]+90)/180*80} r="4" className="map-locator"/>}</>}</svg>;
}
export default function CountryMascot({country,expression='friendly'}:{country:CountryProfile|null;expression?:Expression}){
 const kind=animalStyle(country),bird=['bird','eagle','rooster','kiwi','swan'].includes(kind),horned=['antelope','buffalo','giraffe','okapi'].includes(kind),longEars=['kangaroo','hare','llama'].includes(kind);
 const palette:Record<string,[string,string,string]>={tiger:['#ef9b32','#ffe4af','#422f30'],beaver:['#a56c43','#e9bd86','#413e47'],panda:['#f5f3e9','#fffdf4','#343d4c'],lion:['#dfab56','#fff0c4','#8d542f'],bear:['#a47a58','#ead5b8','#5e463c'],wolf:['#91a5b5','#e3ebf1','#425767'],fox:['#e29654','#fff0d5','#6c4e43'],eagle:['#8f7256','#fff9df','#523f38'],rooster:['#db8b39','#ffdf9a','#3f5560'],bird:['#709c9a','#dcecd8','#395668'],kiwi:['#a68b66','#e7d7b7','#5b4d40'],swan:['#faf7eb','#ffffff','#cc8a38'],kangaroo:['#c18a5b','#f3d9ae','#745747'],elephant:['#9aa8ba','#d5dbe5','#66788c'],buffalo:['#87705d','#e0cbae','#4c4240'],antelope:['#c6a47a','#fff3d5','#65554a'],zebra:['#f2f0df','#fffdf2','#384551'],giraffe:['#ebbc65','#ffedc5','#92643b'],camel:['#c6a072','#fbe7c5','#826549'],tapir:['#798a95','#d3dfe2','#43505a'],hare:['#b3a293','#f7e9d6','#766456'],leopard:['#d0d3d1','#fbfaf2','#5e6b73'],dragon:['#89b996','#e0e8aa','#3f7165'],llama:['#d8b58a','#fff1d6','#92714e'],okapi:['#9c7257','#f4dec5','#554536'],marten:['#98765b','#f8dfb7','#5d493c']};
 const [coat,cream,ink]=palette[kind]||palette.fox;const joy=expression==='joy',laugh=expression==='laugh';
 return <div className={'country-mascot mood-'+expression} role="img" aria-label={(country?.name||'Worldwide')+' · '+animalName(country)+' · '+expression} title={animalStatus(country)}>
 <CountryMap country={country}/>
 <svg viewBox="0 0 240 260" className="animal-cartoon" aria-hidden="true">
 <ellipse cx="121" cy="243" rx="67" ry="9" fill="#315978" opacity=".12"/>
 <g className="animal-body" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 {/* Distinctive tails sit behind the body. */}
 {kind==='beaver'?<g transform="rotate(30 179 178)"><ellipse cx="179" cy="178" rx="26" ry="48" fill="#665b54"/><path d="M158 155l40 36m-43-15 36 32m-26-67 37 35m-39 24 36-44m-44 29 35-42" fill="none" stroke="#998a75" strokeWidth="2"/></g>:!bird&&<path className="animal-tail" d={kind==='kangaroo'?'M158 202Q228 240 225 173Q205 213 166 175':'M160 194Q221 184 206 150Q198 140 190 148'} fill="none" stroke={coat} strokeWidth={kind==='fox'?22:13}/>}
 {kind==='lion'&&<path d="M190 147q20-20 25 1-1 19-20 11Z" fill={ink}/>}
 {kind==='camel'&&<path d="M63 167Q43 97 82 134L157 136Q190 107 177 180Z" fill={coat}/>}
 <ellipse cx="119" cy="180" rx={bird?49:51} ry="58" fill={coat}/>
 <ellipse cx="119" cy="188" rx="33" ry="40" fill={cream} stroke="none"/>
 {kind==='kangaroo'&&<path d="M94 194H145Q141 219 120 221Q99 219 94 194Z" fill={coat}/>}
 <ellipse cx="86" cy="234" rx="28" ry="11" fill={bird?'#d5a55b':coat}/><ellipse cx="151" cy="234" rx="28" ry="11" fill={bird?'#d5a55b':coat}/>
 {kind==='panda'&&<><ellipse cx="86" cy="234" rx="28" ry="11" fill={ink}/><ellipse cx="151" cy="234" rx="28" ry="11" fill={ink}/></>}
 <path d="M77 159Q49 150 40 179Q45 191 56 181L83 175" fill={coat}/>
 <g className="animal-wave"><path d="M158 164Q181 160 182 139L195 137Q205 167 169 183" fill={coat}/><ellipse cx="189" cy="136" rx="13" ry="15" fill={kind==='panda'?ink:coat}/><path d="M184 130v8m7-10v9" fill="none" strokeWidth="2"/></g>
 {kind==='lion'&&<path d="M58 60 76 47 83 30 103 36 120 22 137 36 159 30 167 49 185 62 180 86 192 106 175 122 173 143 150 146 135 161 114 151 94 160 80 142 59 135 61 113 45 97 56 79Z" fill="#b97937"/>}
 {kind==='elephant'?<><ellipse cx="65" cy="94" rx="26" ry="39" fill={coat}/><ellipse cx="175" cy="94" rx="26" ry="39" fill={coat}/><ellipse cx="64" cy="96" rx="15" ry="26" fill="#ccabb0" stroke="none"/><ellipse cx="176" cy="96" rx="15" ry="26" fill="#ccabb0" stroke="none"/></>:!bird&&<><path d={longEars?'M79 71Q51 4 77 15Q95 33 97 66':kind==='fox'||kind==='wolf'?'M69 71 58 29Q84 29 97 63':'M74 75Q47 52 65 41Q87 32 98 67'} fill={kind==='panda'?ink:coat}/><path d={longEars?'M143 68Q148 4 167 17Q174 39 160 77':kind==='fox'||kind==='wolf'?'M143 63Q160 30 182 30L172 79':'M143 67Q153 32 176 44Q192 60 164 80'} fill={kind==='panda'?ink:coat}/></>}
 {horned&&<><path d={kind==='buffalo'?'M85 67Q37 62 52 31Q57 54 91 48':'M91 62Q70 22 80 8L103 59'} fill={cream}/><path d={kind==='buffalo'?'M151 65Q202 62 188 31Q178 55 147 48':'M141 61 160 8Q170 23 153 65'} fill={cream}/></>}
 {kind==='rooster'&&<path d="M99 57Q78 23 101 27Q109 2 121 27Q146 8 147 43L137 60" fill="#df5e55"/>}
 <ellipse cx="120" cy="96" rx={bird?49:61} ry="52" fill={kind==='eagle'?cream:coat}/>
 {kind==='panda'&&<><ellipse cx="94" cy="89" rx="18" ry="22" fill={ink} transform="rotate(15 94 89)"/><ellipse cx="145" cy="89" rx="18" ry="22" fill={ink} transform="rotate(-15 145 89)"/></>}
 {(kind==='tiger'||kind==='zebra')&&<g stroke={ink} strokeWidth="6"><path d="M102 47 108 62m14-17v15m17-11-7 14M64 87l17 7m-20 7 18 6m97-22-17 9m21 9-20 6"/></g>}
 {kind==='leopard'&&<g fill={ink} stroke="none">{[[88,62],[147,64],[63,93],[175,95],[73,116],[163,119],[120,54]].map(([x,y])=><circle key={x} cx={x} cy={y} r="4"/>)}</g>}
 {kind==='giraffe'&&<g fill={ink} stroke="none"><path d="m92 52 16 2-3 12-14 3Zm42 2 16 6-3 15-14-5ZM72 115l14-5 8 15-15 7ZM149 114l16 5-7 13-14-6Z"/></g>}
 <ellipse cx="120" cy="117" rx="35" ry="25" fill={cream} stroke="none"/>
 <g className="animal-eyes">
 {laugh?<><path d="m82 88 12-8 12 8m28 0 12-8 12 8" fill="none" strokeWidth="4"/></>:<>{[94,146].map((x,i)=><g key={x}>{expression==='confident'&&i===1?<path d="M135 88q11-9 22 0" fill="none" strokeWidth="4"/>:<><ellipse cx={x} cy="86" rx="14" ry="18" fill="white" strokeWidth="2"/><ellipse cx={x+2} cy="89" rx="6" ry="9" fill={ink} stroke="none"/><circle cx={x+4} cy="84" r={joy?4:2.5} fill="white" stroke="none"/>{joy&&<path d={`M${x-5} 79h10m-5-5v10`} stroke="white" strokeWidth="2"/>}</>}</g>)}</>}
 </g>
 <g className="animal-cheeks" fill="#e88c8e" opacity={joy||laugh?'.7':'.35'} stroke="none"><ellipse cx="76" cy="111" rx="11" ry="6"/><ellipse cx="164" cy="111" rx="11" ry="6"/></g>
 {bird?<path d={kind==='kiwi'?'M113 103 126 103 119 146Z':'M109 103Q120 96 132 103L120 115Z'} fill="#eab253"/>:<path d="M112 102Q120 98 128 102L120 110Z" fill={ink}/>}
 {(joy||laugh)?<><path d={laugh?'M100 119Q120 132 141 119Q143 150 120 150Q97 150 100 119Z':'M99 121Q120 131 141 121Q137 144 120 145Q104 142 99 121Z'} fill="#643e43"/><path d="M110 141Q120 132 133 141" stroke="#ef9698" strokeWidth="6"/>{kind==='beaver'&&<path d="M110 122v14h19v-14m-9 1v13" fill="white" strokeWidth="2"/>}</>:<path d="M101 122Q120 139 139 121" fill="none" strokeWidth="3"/>}
 {kind==='beaver'&&!joy&&!laugh&&<path d="M111 126v13h18v-13m-9 0v13" fill="white" strokeWidth="2"/>}
 {kind==='elephant'&&<path d="M113 109Q99 160 125 157Q141 156 134 145" fill="none" stroke={coat} strokeWidth="16"/>}
 {kind==='tapir'&&<path d="M117 104Q143 104 137 125" fill="none" stroke={coat} strokeWidth="16"/>}
 {laugh&&<g fill="#81c5e5" stroke="none"><path d="M74 96q-12 12-3 16 9-1 3-16Z"/><path d="M167 96q12 12 3 16-9-1-3-16Z"/></g>}
 {['tiger','lion','beaver','fox','leopard','marten'].includes(kind)&&<g fill="none" strokeWidth="1.5"><path d="m87 113-30-5m30 12-28 4m94-11 30-5m-30 12 28 4"/></g>}
 </g>
 {joy&&<g className="animal-celebrate" fill="#eabb58"><path d="m33 56 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z"/><path d="m202 78 2-6 3 6 6 2-6 3-3 6-2-6-6-3Z"/><circle cx="196" cy="36" r="4"/></g>}
 <g className="mascot-country-seal"><rect x="175" y="10" width="52" height="27" rx="13" fill="white" stroke="#d7e6ed"/><text x="201" y="28" textAnchor="middle" fill="#39728a" fontSize="12" fontWeight="800" fontFamily="sans-serif">{country?.code||'WORLD'}</text></g>
 </svg></div>;
}