const express = require('express')
const app = express()
const port = 8006
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:8004',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.get('/getResource', cors(corsOptions), (req, res) => {
    res.status(200).json([  
        {  
           name:'arun',
           gender:'Male',
           physics:88,
           maths:87,
           english:78
        },
        {  
           name:'rajesh',
           gender:'Male',
           physics:96,
           maths:100,
           english:95
        },
        {  
           name:'moorthy',
           gender:'Male',
           physics:89,
           maths:90,
           english:70
        },
        {  
           name:'raja',
           gender:'Male',
           physics:30,
           maths:25,
           english:40
        },
        {  
           name:'usha',
           gender:'Female',
           physics:67,
           maths:45,
           english:78
        },
        {  
           name:'priya',
           gender:'Female',
           physics:56,
           maths:46,
           english:78
        },
        {  
           name:'Sundar',
           gender:'Male',
           physics:12,
           maths:67,
           english:67
        },
        {  
           name:'Kavitha',
           gender:'Female',
           physics:78,
           maths:71,
           english:67
        },
     ])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})