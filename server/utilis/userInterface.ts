export interface validateUsers{
    firstName : string,
    lastName:string,
    email: string,
    DOB : string,
    password:string
    confirmPass:string,
    userId: number,
    registerDate: any
  }

  export interface transferBodyInput {
    senderAccount:Number,
    amount:string,
    receiverAccount:Number,
    transferDescription:string
  }