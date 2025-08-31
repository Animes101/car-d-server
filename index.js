const express=require('express');
const app=express();
const cors=require('cors');


app.use(cors());
app.use(express.json());




app.get('/' , (req,res)=>{



    res.send('doctor is running ');
})


app.listen(3000, ()=>{

    console.log('server is running ')
})