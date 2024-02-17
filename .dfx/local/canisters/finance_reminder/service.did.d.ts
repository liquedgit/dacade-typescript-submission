import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'authenticate' : ActorMethod<
    [string],
    { 'money' : number, 'listTransactionsid' : Array<string>, 'name' : string }
  >,
  'createTransaction' : ActorMethod<
    [string, string, number, string],
    { 'Ok' : string } |
      { 'Err' : string }
  >,
  'getUserTransactions' : ActorMethod<
    [string],
    Array<
      {
        'id' : string,
        'foreign_user_id' : string,
        'user' : string,
        'description' : string,
        'amount' : number,
      }
    >
  >,
  'topupMoney' : ActorMethod<
    [string, number],
    {
        'Ok' : {
          'money' : number,
          'listTransactionsid' : Array<string>,
          'name' : string,
        }
      } |
      { 'Err' : string }
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
