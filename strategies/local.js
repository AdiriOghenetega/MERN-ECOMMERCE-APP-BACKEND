const passport =require("passport")
const {Strategy} = require("passport-local")
const User = require("../database/schemas/user")
const {comparePassword} = require("../utils/helper")

passport.serializeUser((user,done)=>{
    console.log("serialing user...")
    done(null,user.id)
})

passport.deserializeUser(async(id,done)=>{
    console.log("deserializing user id...")
    
    try{
     const user = await User.findById(id)
     if(!user) throw new Error("user not found")
     done(null,user)
    }catch(err){
        console.log(err)
        done(err,null)
    }
})

passport.use(
    new Strategy(
        {usernameField : "email"},
        async (email,password,done)=>{
            
            try{
              if(!email || !password) throw new Error("missing credentials")
              const userDB = await User.findOne({email})
                          if(!userDB) throw new Error("user not found")
                          const isValidPass = comparePassword(password,userDB.password)
                          if(!isValidPass) {
                            console.log("authentication failed")
                              done(null,null)
                          }else{
                              console.log("authentication successful")
                              done(null,userDB)
                          }
            } catch(err) {
                console.log(err)
                done(err,null)
            }
        }
    )
)