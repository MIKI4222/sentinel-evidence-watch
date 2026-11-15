import type {Pending} from './types';
export function isFinalSuccess(status:string,sdkSuccess:boolean){return status==='FINALIZED'&&sdkSuccess}
export function isTrackingComplete(status?:string){return status==='FINALIZED'||status==='CANCELED'}
export function duplicatePending(items:Pending[],sourceId:string,method:string){return items.some(p=>p.sourceId===sourceId&&p.method===method&&!isTrackingComplete(p.status))}
