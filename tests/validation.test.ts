import {describe,it,expect} from 'vitest'; import {validateRegistration,type Registration} from '../src/lib/validation';
const good:Registration={id:'grant-rules',url:'https://example.org/page',name:'Grant rules',description:'Public grant programme rules',instructions:'',context:'',items:['Deadline','Eligibility']};
describe('contract registration validation',()=>{
 it('accepts valid input',()=>expect(validateRegistration(good)).toEqual([]));
 it('accepts empty watch list for contract defaults',()=>expect(validateRegistration({...good,items:[]})).toEqual([]));
 it('rejects malformed IDs',()=>expect(validateRegistration({...good,id:'-Invalid'}).length).toBeGreaterThan(0));
 it('rejects credentials',()=>expect(validateRegistration({...good,url:'https://user:pass@example.org'}).length).toBeGreaterThan(0));
 it('rejects private and loopback hosts',()=>{for(const url of ['http://127.0.0.1','http://192.168.0.1','http://service.internal'])expect(validateRegistration({...good,url}).length).toBeGreaterThan(0)});
 it('rejects non-http URL',()=>expect(validateRegistration({...good,url:'ftp://example.org'}).length).toBeGreaterThan(0));
 it('rejects short description',()=>expect(validateRegistration({...good,description:'short'}).length).toBeGreaterThan(0));
 it('rejects duplicate watch items ignoring case',()=>expect(validateRegistration({...good,items:['Deadline','deadline']}).length).toBeGreaterThan(0));
 it('rejects more than eight watch items',()=>expect(validateRegistration({...good,items:Array.from({length:9},(_,i)=>`item ${i}`)}).length).toBeGreaterThan(0));
 it('rejects delimiter embedded in a watch item',()=>expect(validateRegistration({...good,items:['deadline||eligibility']}).length).toBeGreaterThan(0));
 it('rejects out of bounds watch item lengths',()=>expect(validateRegistration({...good,items:['ab']}).length).toBeGreaterThan(0));
});
