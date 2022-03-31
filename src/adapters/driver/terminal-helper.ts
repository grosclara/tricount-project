import * as readline from 'readline';

export class Terminal {
    constructor() {}
  
    print(message : string) {
      console.log(message)
      return Promise.resolve()
    }
  
    readInput( questionMessage: string ) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
  
      return new Promise<string>((resolve) => {
        rl.question(questionMessage, function (name : string) {
          rl.close()
          resolve(name)
        })
      })
    }
}