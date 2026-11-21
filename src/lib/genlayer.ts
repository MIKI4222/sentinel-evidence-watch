import {createClient,isSuccessful} from 'genlayer-js';
import {studioDevnet} from 'genlayer-js/chains';
import {TransactionHashVariant} from 'genlayer-js/types';
import {parseAccount} from 'viem/accounts';
import type {Provider,Source,Baseline,RecordView,Integration,Snapshot} from './types';
export const DEFAULT_CONTRACT='0xe377EBA9359CA71Ad64D4BB65e5BC0Ff897aC3D8' as const;
export const CONTRACT=(import.meta.env.VITE_GENLAYER_CONTRACT_ADDRESS||DEFAULT_CONTRACT) as `0x${string}`;
export const EXPLORER=import.meta.env.VITE_GENLAYER_EXPLORER_URL||'https://explorer-studio-next.genlayer.com';
export const RPC='https://studio-dev.genlayer.com/api'; export const CHAIN=61997;
export const readClient=createClient({chain:studioDevnet});
export function walletClient(provider:Provider,address:string){return createClient({chain:studioDevnet,provider:provider as never,account:address as `0x${string}`})}
let active=0; const waiting:(()=>void)[]=[];
async function limited<T>(fn:()=>Promise<T>):Promise<T>{if(active>=2)await new Promise<void>(resolve=>waiting.push(resolve));active++;try{return await fn()}finally{active--;waiting.shift()?.()}}
let cacheEpoch=0;const inflight=new Map<string,Promise<unknown>>();
export async function view<T>(method:string,args:string[]=[]):Promise<T>{const key=JSON.stringify([cacheEpoch,method,args]);let request=inflight.get(key);if(!request){request=limited(()=>readClient.readContract({address:CONTRACT,functionName:method,args,transactionHashVariant:TransactionHashVariant.LATEST_FINAL}));inflight.set(key,request);request.finally(()=>inflight.delete(key)).catch(()=>{});}return await request as T}
const snapshots=new Map<string,{at:number,value:Snapshot}>();const snapshotRequests=new Map<string,Promise<Snapshot>>();
export function clearSnapshotCache(){cacheEpoch++;snapshots.clear()}

export async function getSnapshot(id:string):Promise<Snapshot>{const hit=snapshots.get(id);if(hit&&Date.now()-hit.at<45000)return hit.value;const epoch=cacheEpoch;const key=`${epoch}:${id}`;const existing=snapshotRequests.get(key);if(existing)return existing;const request=fetchSnapshot(id);snapshotRequests.set(key,request);try{const value=await request;if(cacheEpoch===epoch)snapshots.set(id,{at:Date.now(),value});return value}finally{snapshotRequests.delete(key)}}
async function fetchSnapshot(id:string):Promise<Snapshot>{
 const source=await view<Source>('get_source',[id]); const [integration,count,history]=await Promise.all([view<Integration>('get_integration_status',[id]),view<number>('get_version_count',[id]),view<RecordView[]>('get_check_history',[id])]);
 const [baseline,latest]=count>0?await Promise.all([view<Baseline>('get_baseline',[id]),view<RecordView>('get_latest_check',[id])]):[null,null];
 return {source,integration,count,history,baseline,latest};
}
export function errorText(e:unknown):string {if(e instanceof Error)return e.message;return String(e)}
export async function prepare(provider:Provider,address:string,method:string,args:string[]){
 const chain=await provider.request({method:'eth_chainId'});const accounts=await provider.request({method:'eth_accounts'}) as string[];
 if(Number(chain)!==CHAIN)throw new Error('Wallet is on the wrong network. Switch to Studio Dev (61997).');
 if(!accounts?.some(a=>a.toLowerCase()===address.toLowerCase()))throw new Error('Wallet account changed. Reconnect before continuing.');
 const c=walletClient(provider,address);const account=parseAccount(address as `0x${string}`);
 const estimate=await c.estimateTransactionFeesForWrite({account,address:CONTRACT,functionName:method,args});return {c,estimate};
}
export async function transaction(hash:`0x${string}`){const txHash=hash as Parameters<typeof readClient.getTransaction>[0]['hash'];const tx=await readClient.getTransaction({hash:txHash});let lifecycle:unknown=null;try{lifecycle=await readClient.advanced.getTransactionLifecycle({hash:txHash})}catch{/* stored transaction remains authoritative */}return {tx,lifecycle,success:isSuccessful(tx)}}
