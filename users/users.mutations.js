import client from "../client"
import bcrypt from "bcrypt";

export default {
    Mutation: {
        createAccount: async(_, {username,email,name,location, password, avatarURL, githubUsername})=>{
            //check if username or email are already on DB
            const existingUser = await client.user.findFirst({
                where:{
                    OR: [
                        {
                            username,
                        },{
                            email,
                        }
                    ]
                }
            });

            
            console.log(existingUser);

            if (existingUser) {
                return {"ok": false, "error": "$error"}
            }
            const uglyPasssword = await bcrypt.hash(password,10);
            client.user.create({
                data:{
                    username, email, name, location, password:uglyPasssword, avatarURL, githubUsername
                }
            });
            return {"ok": true}
        }
    },
};