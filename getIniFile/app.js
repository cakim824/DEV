require('dotenv').config();

const axios = require('axios')
var ini = require('ini')

const express = require('express');
const app = express();
var port = 4001;

const configHeaders = {
    headers: {
        'Authorization': 'Basic QWRtaW46cXdFUjEyIyQ='
    }
}

const getIniFile = async() => {
    var sbcInfo = new Array
    await axios.get('http://211.251.236.99/api/v1/files/ini', configHeaders)
    .then(function (response) {
        console.log('---------------[getIniFile]--------------')
        var config = ini.parse(response.data)
        var ipGroup = config.IPGroup

        for(key in ipGroup) {
            var ipGroupInfo = new Object()
            var ipGroupIndex = parseInt(key.replace('IPGroup ', ''))
            var ipGroupName = ipGroup[key].split(',')
            // console.log('[FIND IPGROUP INDEX : NAME] ', ipGroupIndex, ':', ipGroupName[1])
            ipGroupInfo.index = ipGroupIndex
            ipGroupInfo.name = ipGroupName[1].replace(/\"/gi, '').replace(/ /gi, '')
            ipGroupInfo.indexname = String(ipGroupIndex).concat(" ", ipGroupInfo.name)
            sbcInfo.push(ipGroupInfo)
        }
        console.log("[RESULT]", JSON.stringify(sbcInfo))
        // console.log(sbcInfo)
    })
    .catch(function (error) {
        console.log(error)
    })
    return sbcInfo
}


const wrapper = asyncFn => {
    return (async(req, res, next) => {
        try {
            return await asyncFn(req, res, next)
        } catch (err) {
            return next(err)
        }
    })
}

app.get('/sbc', wrapper(async(req, res, next) => {
    var responseData = 'aaaaa'
    responseData = await getIniFile();
    res.status(200).json(responseData);
    // res.sendFile('./index.html')
}))

if(!module.parent) {
    app.listen(port, function() {
        const d = new Date();
        console.log("SBC CONFIG SERVER START", d.toTimeString()); 
    })
}

module.exports = app;