export interface Registration {id:string;url:string;name:string;description:string;instructions:string;context:string;items:string[]}
export function validateRegistration(v:Registration):string[] {
 const e:string[]=[];const id=v.id.trim(), url=v.url.trim(), name=v.name.trim(), desc=v.description.trim();
 if(!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(id)) e.push('Source ID must be 3–64 lowercase letters, digits, dots, underscores or hyphens, starting with a letter or digit.');
 const m=url.match(/^https?:\/\/([^/\s:?#@]+)(:\d{1,5})?([/?#]\S*)?$/i);
 if(url.length>500||!m||!m[1].includes('.')||/^(localhost|0\.0\.0\.0|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|\[.*\]|.*\.local|.*\.internal)$/i.test(m?.[1]||'')) e.push('Enter a public HTTP(S) URL, without credentials, up to 500 characters.');
 if(!name||name.length>120)e.push('Name is required and must be at most 120 characters.');
 if(desc.length<10||desc.length>1000)e.push('Description must be 10–1000 characters.');
 if(v.instructions.trim().length>1000||v.context.trim().length>1000)e.push('Instructions and context must be at most 1000 characters each.');
 const items=v.items.map(x=>x.trim()).filter(Boolean); if(items.length>8)e.push('Use at most 8 watch items.');
 if(items.some(x=>x.length<3||x.length>120||/\|\||\n|\\n/.test(x)))e.push('Each watch item must be 3–120 characters and must not contain delimiters.');
 if(new Set(items.map(x=>x.toLowerCase())).size!==items.length)e.push('Watch items must be unique (case-insensitive).');
 return e;
}
