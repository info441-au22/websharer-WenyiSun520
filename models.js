import mongoose from 'mongoose';
let models = {
    Post: ""
}
main().catch(err => console.log("there is a problem when connecting to the database: " + err));
async function main(){
    await mongoose.connect(
      "mongodb+srv://catowel:SUN19990520@cluster0.vszkld0.mongodb.net/websharer?retryWrites=true&w=majority"
    );

    const postSchema = new mongoose.Schema({
        url: String,
        description: String,
        created_date: Date,
        username: String,
        likes:[String]
    })
    models.Post = mongoose.model("Post", postSchema);

    const commentSchema = new mongoose.Schema({
      username: String,
      comment: String,
      post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
      created_date: Date,
    });
    
     // save the model in the global variable "models" with key post
    models.Comment = mongoose.model('Comment', commentSchema);


    const userInfoSchema = new mongoose.Schema({
      username: String,
      nikename: String,
      diary: [{
        created_date: Date,
        diary_content: String
      }]
    })
    models.UserInfo = mongoose.model("UserInfo", userInfoSchema);

    console.log("Connect to mongodb successfully!");

}

export default models;