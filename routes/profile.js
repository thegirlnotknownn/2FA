const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    res.render('profile',{
        title:'pROFILE?'
    });
});

module.exports = router;