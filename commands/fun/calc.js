const Base = require("../../base/Command.js");

module.exports = class Calc extends Base {
    constructor(client) {
        super(client, {
            name: "calc",
            description: "Calculates using an operation and numbers.",
            usage: "<operation> <num1> [num2 (if needed)]",
            category: "fun",
            permLevel: 0 
        });
    }

    async run(message, args) {
        // Ignore if sent in dfchat
        if (message.channel.name === "dfchat") return super.error("You can't use that here!");
        
        let f = [];
        
        function factorial (n) {
            if (n == 0 || n == 1) return 1;
            if (f[n] > 0) return f[n];
            
            return f[n] = factorial(n-1) * n;
        };
        
        const operation = args[0]
        const one = parseInt(args[1]);
        const two = parseInt(args[2]);
        
        if (isNaN(one)) return super.error("Invalid number.");
        if (["add", "multiply", "divide", "exponent"].includes(operation) && isNaN(two)) return super.error("This operation requires a second parameter.");
        
        // Extract properties from math
        const { pow, sqrt } = Math;
        
        let ans;

        if (operation === "add") ans = one + two; 
        else if (operation === "subtract") ans = one - two;
        else if (operation === "multiply") ans = one * two;
        else if (operation === "divide") {
            if (two === 0) return super.error("Cannot divide by 0.");
            ans = one / two;
        }
        else if (operation === "exponent") ans = pow(one, two);
        else if (operation === "sqrt") ans = sqrt(one, two || 2);
        else if (operation === "factorial") ans = factorial(one);
        
        super.respond(`The answer is \`${ans}\`.`);
    }
};
