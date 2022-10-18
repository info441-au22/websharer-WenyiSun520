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
        created_date: Date
    })
    console.log("Connect to mongodb successfully!");
     // save the model in the global variable "models" with key post
    models.Post = mongoose.model("model", postSchema);

}

export default models;