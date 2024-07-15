const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const path=require('path');
const db=require('./config/config');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const multer=require('multer');
const uploadMiddleWare = multer({ dest: 'uploads/' });
const fs=require('fs');
const User=require('./models/User');
const Post=require('./models/Post');
const { title } = require('process');
const app=express();

dotenv.config({path:path.join(__dirname,'config','config.env')});

const salt=bcrypt.genSaltSync(10);
const secret='6872r23udydgnn23y749';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'))

db();

app.post('/api/register',async(req,res)=>{
    const {userName,password}=req.body;

    try{
        const user=new User({
            userName,
            password:bcrypt.hashSync(password,salt),
        });
        await user.save();
        res.status(201).json({message:'user registered Successfully'});
    }catch(err){
        console.error(err);
        res.status(500).json({error:'Failed to regsiter user'})
    }
    
    
});

app.post('/api/login',async(req,res)=>{

    const {userName,password}=req.body;

    const user=await User.findOne({userName});
    const passOk=bcrypt.compareSync(password,user.password);
    if(passOk){
        jwt.sign({userName,id:user._id},secret,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json({
                id:user._id,
            userName,            
        });

        });

    }else{
        res.status(400).json('Wrong Credentials')
    }


    // res.json('helloworld')
});

app.get('/api/profile',(req,res)=>{
    const {token}=req.cookies;
      
    jwt.verify(token,secret,{},(err,info)=>{
        // res.json('is it working?')
        if(err) throw err;
        
        res.json(info);
        // console.log(decoded)
        
    });
});

app.post('/api/logout',(req,res)=>{
    res.cookie('token','').json('ok')
})

app.post('/api/post',uploadMiddleWare.single('files'),async(req,res)=>{
    const {originalname,path}=req.file;
    const parts=originalname.split('.');
    const ext=parts[parts.length-1];
    const newPath=path+'.'+ext;
    fs.renameSync(path,newPath);
     
    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const {title,summary,content}=req.body;
        const postDoc=await Post.create({
            title,
            summary,
            content,
            cover:newPath,
            author:info.id,
        })
        res.json(postDoc);
        
        
    });
    

    
    // res.json('posting content')
});

app.put('/api/post',uploadMiddleWare.single('files'),async (req,res)=>{
    let newPath=null;
    if(req.file){
        const {originalname,path}=req.file;
        const parts=originalname.split('.');
        const ext=parts[parts.length-1];
        newPath=path+'.'+ext;
        fs.renameSync(path,newPath);
    }

    const {token}=req.cookies;
    jwt.verify(token,secret,{},async(err,info)=>{
        if(err) throw err;
        const { id, title, summary, content } = req.body;
        const postDoc=await Post.findById(id);

        const isAuthor=JSON.stringify(postDoc.author)===JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('you are not the author')
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover:newPath?newPath:postDoc.cover,
        })
        res.json(postDoc)
        
        
    });
    

})

app.get('/api/post',async(req,res)=>{
    res.json(
        await Post.find()
        .populate('author',['userName'])
        .sort({createdAt:-1})
);
});

app.get('/post/:id',async (req,res)=>{
    const {id}=req.params;
    const postDoc=await Post.findById(id).populate('author',['userName']);
    res.json(postDoc);
})
app.listen(process.env.PORT,()=>{
    console.log(`Server listening on ${process.env.PORT}`)
})