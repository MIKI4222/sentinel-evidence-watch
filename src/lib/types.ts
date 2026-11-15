export interface Source {source_id:string; owner:string; source_url:string; source_name:string; description:string; instructions:string; reference_context:string; watch_items:string[]; status:'REGISTERED'|'ACTIVE'|'DEACTIVATED'; registered_at:string; updated_at:string}
export interface BaselineItem {item:string;present:boolean;value:string}
export interface CheckItem {item:string;base_present:boolean;present_now:boolean;change:string;value:string;note:string}
export interface Baseline {source_id:string;baseline_version:number;title:string;subject:string;source_type:string;summary:string;version_info:string;observed_date:string;items:BaselineItem[]}
export interface Change {item:string;value?:string;previous_value?:string;new_value?:string}
export interface RecordView {source_id:string;version:number;previous_version:number;kind:'BASELINE'|'CHECK';status:string;title:string;change_summary:string;added_information:Change[];removed_information:Change[];modified_information:Change[];affected_requirements:string[];important_findings:string[];items:(BaselineItem|CheckItem)[];confidence:number;observed_at:string;baseline_version:number;baseline_updated:boolean;requested_by:string}
export interface Integration {source_id:string;source_url:string;source_owner:string;source_status:string;baseline_version:number;latest_version:number;latest_status:string;latest_check_summary:string;last_successful_check:{version:number;at:string}}
export interface Snapshot {source:Source; baseline:Baseline|null; latest:RecordView|null;history:RecordView[]; count:number;integration:Integration}
export interface Pending {hash:`0x${string}`;method:string;sourceId:string;sender:string;submittedAt:string;status?:string;result?:string;lifecycle?:string;success?:boolean}
export interface Provider {request(args:{method:string;params?:unknown[]|object}):Promise<unknown>;on?(event:string,cb:(arg:unknown)=>void):void;removeListener?(event:string,cb:(arg:unknown)=>void):void}
declare global {interface Window {ethereum?:Provider}}
