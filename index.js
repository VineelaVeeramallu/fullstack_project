var express = require('express')
var app = express()
var  ejs = require('ejs');
const bp = require('body-parser');
const port = 3000;
const axios = require('axios');
app.use(express.static('public'));
app.set('view engine',ejs);
app.use(bp.urlencoded({extended:true}))
app.use("/songs",express.static('songs'));

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
   credential: cert(serviceAccount)
  });
  const db = getFirestore();
app.get('/', function (req, res)  {
    res.render( __dirname + "/views/" + "main.ejs");
})  
app.get('/signup', function (req, res)  {
    res.render( __dirname + "/views/" + "signup.ejs",{data:""});

})
app.get('/login', function (req, res) {
    res.render( __dirname + "/views/" + "login.ejs",{data1:""} );

})
app.get('/dashboard',(req,res)=>{
     res.render('dashboard.ejs',{
   wor:"",pho:"",def:"",org:"",pos:"",exm:""});
});
app.post('/dashboard',async(req,res)=>{
    const word = req.body.word;
    console.log(word);
    try{
        const response =await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word} `);
         const data = response.data;
      console.log(data);
       const wor = data[0].word;
      console.log(wor);
       const pho = data[0].phonetic;
      console.log(pho);
        const def = data[0].meanings[0].definitions[0].definition;
      console.log(def)
     // const org = data[0];
     //  console.log(org)
        const pos = data[0].meanings[0].partOfSpeech;
        const exm=data[0].example;
     
      console.log(pos);
      res.render('dashboard.ejs',{
    wor:wor,pho:pho,def:def,pos:pos,exm:exm});
    }
    catch(error){
        console.log(error);
    }
     
       
})

app.post('/signup', (req, res) => {
   
    
    db.collection('Database').add({
       Fullname :req.body.Fullname,
       Email :req.body.Email,
       Password :req.body.password
      }).then((data)=>{
      if(data.id){
        res.redirect("/login");
        alert("Now please login to your account");
      }else{
        res.render('signup.ejs',{data:"upload unsucessful"})
      }
      });
    });


    app.post('/login',  (req, res) => {
        
        db.collection('Database').where("Email","==",req.body.Email)
        .where("Password","==",req.body.password)
        .get().then((docs)=>{
            if(docs.size > 0){
               res.redirect("/dashboard");
              alert("You successfully logged in");
            }
            else{
                res.render("login.ejs",{data1:"login fail"});
            }
            
        });
    });
app.post('/main',(req,res)=>{
 const button = req.body.button;
  if(button == 'p1'){
    res.redirect('/login');
  }else{
     res.redirect('/signup');
  }
})
app.listen(3000,()=>{
    console.log("server started");
})

