import {describe,expect,it} from 'vitest';import {duplicatePending,isFinalSuccess,isTrackingComplete} from '../src/lib/lifecycle';import type {Pending} from '../src/lib/types';
const base:Pending={hash:'0x1234',method:'check_source',sourceId:'a',sender:'0x1',submittedAt:'2026-11-14',status:'PENDING'};
describe('transaction safety decisions',()=>{
 it.each(['PENDING','PROPOSING','COMMITTING','REVEALING','ACCEPTED','UNDETERMINED','LEADER_TIMEOUT','VALIDATORS_TIMEOUT'])('does not claim %s is finalized success',s=>expect(isFinalSuccess(s,true)).toBe(false));
 it('requires a successful execution result in addition to finalization',()=>{expect(isFinalSuccess('FINALIZED',false)).toBe(false);expect(isFinalSuccess('FINALIZED',true)).toBe(true)});
 it('blocks another identical action while existing hash is pending',()=>expect(duplicatePending([base],'a','check_source')).toBe(true));
 it('does not block another method or source',()=>{expect(duplicatePending([base],'b','check_source')).toBe(false);expect(duplicatePending([base],'a','update_source')).toBe(false)});
 it('allows a deliberate retry after a terminal transaction',()=>{expect(duplicatePending([{...base,status:'CANCELED'}],'a','check_source')).toBe(false);expect(duplicatePending([{...base,status:'FINALIZED'}],'a','check_source')).toBe(false)});
 it('does not treat an unknown or timed-out state as terminal',()=>{expect(isTrackingComplete(undefined)).toBe(false);expect(isTrackingComplete('LEADER_TIMEOUT')).toBe(false)});
});
