const mongoose = require ('mongoose');

const authorSchema = new mongoose.Schema({
                    fname: {
                            type: String,
                            required: true
                    },
                    lname: {
                            type: String,
                            required: true
                    },
                    title: {
                        type: String,
                        enum: ["Mr", "Mrs", "Miss"],
                        require: true
                    },
                    email: { 
                        type: String,
                        required: true,
                        match: [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,"Fill a valid email address"],
                        unique: true
                      },
                    
                    
                    password:{
                            require: true,
                            type: String,
                            /* match: [/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "Password must contain, special symbol, a number, uppercase alphabet, a lowercase alphabet and should have 8 to 16 valid characters"] */
                    }

}, { timestamps: true });


module.exports = mongoose.model('Author', authorSchema) //authors