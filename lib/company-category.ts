import {companyKey} from './catalog.ts';
export const companyCategories=['Product & technology','IT services & consulting','Banking & finance','Real estate & operations','Unclassified'] as const;
export type CompanyCategory=typeof companyCategories[number];
export const categoryCharacters:Record<CompanyCategory,string>={'Product & technology':'Doraemon','IT services & consulting':'Ninja Hattori','Banking & finance':'Pikachu','Real estate & operations':'Totoro','Unclassified':'Atlas robot'};
// Curated company-level groupings, not inferred from job titles. Diversified businesses can span categories.
const groups:Partial<Record<CompanyCategory,string[]>>={
 'Product & technology':['Google','Alphabet','Meta','Facebook','Amazon','Amazon Web Services','AWS','Apple','Netflix','Microsoft','Adobe','Salesforce','Zoho','Freshworks','Flipkart','Meesho','Swiggy','Razorpay','PhonePe','Paytm','Stripe','Airbnb','Databricks','Snowflake','MongoDB','Confluent','Atlassian','ServiceNow','Uber','Nvidia','Intuit','Oracle','SAP','Spotify','LinkedIn','GitHub','Cloudflare'],
 'IT services & consulting':['Accenture','TCS','Tata Consultancy Services','Infosys','Wipro','HCLTech','HCL Technologies','Cognizant','Capgemini','Cap Gemini','Tech Mahindra','LTIMindtree','Mphasis','Persistent Systems','Genpact','T-Systems','T-Systems ICT India','EXL','Clairvoyant','EXL (Clairvoyant)','Brillio','Quantiphi','Tiger Analytics','Tredence','LatentView Analytics','Impetus'],
 'Banking & finance':['HSBC','JPMorgan Chase','JPMorgan','JP Morgan','Goldman Sachs','Morgan Stanley','HDFC Bank','ICICI Bank','Axis Bank','Kotak Mahindra Bank','Barclays','Citi','Citigroup','Deutsche Bank','Wells Fargo','Bank of America','Standard Chartered'],
 'Real estate & operations':['JLL','Jones Lang LaSalle','CBRE','Cushman & Wakefield']
};
const mapping=new Map(Object.entries(groups).flatMap(([category,names])=>names!.map(name=>[companyKey(name),category as CompanyCategory] as const)));
export function companyCategory(company:string):CompanyCategory{return mapping.get(companyKey(company))||'Unclassified';}
export function companyCharacter(company:string){return categoryCharacters[companyCategory(company)];}
export const classificationSources=[{category:'IT services & consulting',url:'https://www.tcs.com/what-we-do/services/consulting'},{category:'Banking & finance',url:'https://www.hsbc.com/who-we-are/hsbc-at-a-glance'},{category:'Real estate & operations',url:'https://www.jll.com/en-in/about-jll'}];
