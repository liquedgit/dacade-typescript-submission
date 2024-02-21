import {Canister, query, text, update, Void, StableBTreeMap, Vec, Record, int32, Ok, Result, Err} from 'azle'
import { v4 as uuidv4 } from 'uuid'

const Transaction = Record({
    id : text,
    amount : int32,
    description : text,
    user : text,
    foreign_user_id : text
})

const User = Record({
    name : text,
    money : int32,
    listTransactionsid : Vec(text)
})

type User = typeof User.tsType
type Transaction = typeof Transaction.tsType


let FinanceTree = StableBTreeMap<text, Transaction>(0)
let UserTree = StableBTreeMap<text, User>(1)

export default Canister({
    authenticate : update([text], User, function (name : string) : User{
        const optUser = UserTree.get(name)
        if(optUser.Some){
            return optUser.Some
        }
        const newUser : User = {
            name: name,
            money: 20000,
            listTransactionsid: []
        }
        UserTree.insert(name, newUser)
        return newUser
    }),
    createTransaction : update([text, text,int32, text], Result(text, text), (user: string,toUser: string, amount : number, description : string)=>{
        let user1 = UserTree.get(user).Some
        let user2 = UserTree.get(toUser).Some
        if(user1 && user2){
            const newTransaction : Transaction = {
                id : uuidv4(),
                user : user,
                foreign_user_id: toUser,
                amount: -1 * amount,
                description : description,
            }
            const transaction2: Transaction = {
                id : uuidv4(),
                user: toUser,
                foreign_user_id: user,
                amount : amount,
                description: description
            }
            FinanceTree.insert(newTransaction.id, newTransaction)
            FinanceTree.insert(transaction2.id, transaction2)
            
            user1.money += -1 * amount
            user2.money += amount
            user1.listTransactionsid.push(newTransaction.id)
            user2.listTransactionsid.push(transaction2.id)
            UserTree.insert(user1.name, user1)
            UserTree.insert(user2.name, user2)
            return Ok("Successfully created transaction")
        }
        
        return Err("User not found")
    }),
    getUserTransactions : query([text], Vec(Transaction), (username:string)=>{
        const listTransaction : Vec<Transaction> = []
        const user = UserTree.get(username).Some
        if(user){
            for(const idTr of user.listTransactionsid){
                const tr = FinanceTree.get(idTr).Some
                if(tr){
                    listTransaction.push(tr)
                    
                }
            }
        }
        return listTransaction
    }),
    topupMoney : update([text,int32], Result(User, text), (username : string, money : number)=>{
        if(money <= 0){
            return Err("Top up value must be more than 20000")
        }
        let user = UserTree.get(username).Some
        if(user){
            user.money += money
            const Transaction : Transaction = {
                id : uuidv4(),
                user : username,
                foreign_user_id : user.name,
                amount : money,
                description : "TOP UP",
            }
            user.listTransactionsid.push(Transaction.id)
            FinanceTree.insert(Transaction.id, Transaction)
            UserTree.insert(username, user)
            return Ok(user)
        }
        return Err("Cannot find user " + username)
    })
    

})
