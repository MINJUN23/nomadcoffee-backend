import client from "../client"
import bcrypt from "bcrypt";
import { protectedResolver } from "./users.utils";
import jwt from "jsonwebtoken";

export default {
    Mutation: {
        createAccount: async(_, {username,email,name,location, password, avatarURL, githubUsername})=>{
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
        },

        login: async (_, {username, password})=>{
            const user = await client.user.findFirst({where:{username}})
            if (!user) {
                return {
                    ok: false,
                    error : "No matching user name"
                }
            }
            const passwordOk = bcrypt.compare(password, user.password);
            if(!passwordOk){
                return {
                    ok:false,
                    error: "Invalid Password"
                };
            }
            console.log(user);
            const token = await jwt.sign({id: user.id}, process.env.SECRET_KEY);
            return {
                ok: true,
                token,
            }

        },

        editProfile: protectedResolver(
            async (_, {username,email,name, location, password:newPassword, avatarURL, githubUsername}, {loggedInUser}) => {
            let uglyPassword = null;
            if(newPassword){
                uglyPassword =await bcrypt.hash(newPassword, 10)
            }
            const updatedUser = await client.user.update({
                where:{
                    id:loggedInUser.id
                },
                data:{
                    username,email,name,location,avatarURL,githubUsername,
                    ...(uglyPassword && {password:uglyPassword}),
                }
            })

            if(updatedUser.id){
                return {
                    ok:true
                }
            }else{
                return {
                    ok:false,
                    error: "Could Not Update Profile"
                }
            }
       })
    },
};