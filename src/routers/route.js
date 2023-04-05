const express = require('express');
const router = new express.Router();
const { Configuration, OpenAIApi } = require('openai');
const request = require('request');


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(configuration);

// async function runCompletion() {
//     try {
//         console.log("Printing Answer please wait")
//         const completion = await openai.createCompletion({
//             model: "text-davinci-003",
//             prompt: "chinese dish made with cucumber and onion with recipe",
//             max_tokens:2048
//         })

//         console.log(completion.data.choices);
//     } catch (e) {
//         console.log(e);
//     }
// }

// runCompletion();
router.get('', (req, res) => {
    res.render('index');
})

router.post('/search', async (req, res) => {
    try {
            console.log("Printing Answer please wait")
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: "what dish can i cook with " + req.body.searchTerms + "with Ingridents and Instructions",
                max_tokens: 2048
            })

          console.log(completion.data.choices[0].text);
        const text = [
            {
                text: completion.data.choices[0].text,
                index: 0,
                logprobs: null,
                finish_reason: 'stop'
            }
        ]
        var index1 = -1;
        var index2 = -1;
        for (var i = 0; i < text[0].text.length; i++) {
            if (text[0].text.charAt(i) == ':') {
                if (index1 > 0) {
                    index2 = i;
                } else {
                    index1 = i;
                }
            }
        }
        console.log("Printing name " + text[0].text.substring(0,index1-12));
        //console.log(text[0].text.at(index1-1) + " " + text[0].text.at(index2-12));
        // console.log("Ingredients :");
        // console.log(text[0].text.substring(index1 + 2, index2 - 13));
        // console.log("Instructions:");
        // console.log(text[0].text.substring(index2+2,text[0].text.length));
        res.send({
            name : text[0].text.substring(0,index1-12),
            ingridients : text[0].text.substring(index1 + 2, index2 - 13),
            instructions : text[0].text.substring(index2+2,text[0].text.length)
        })
    } catch (e) {
        console.log(e);
        res.send({
            "error": "Error"
        })
    }
})

router.post('/ytsearch',async (req,res) =>{
    try{;
        const dishName = function (value){
            let newDish = "";
            for(i=0;i<value.length;i++){
                if(value[i] === ' '){
                    newDish = newDish + "+";
                }else{
                    newDish = newDish + value[i];
                }
            }
            return newDish;
        }
        const passingName = dishName(req.body.name);
        const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&key="+ process.env.YOUTUBE_API_KEY+"&maxResults=2&type=video&q=" + passingName;
        
        request({url,json:true} , (error, { body }) => {
            if(error) {
                throw new Error("Couldn't connect to the youtube API");
            }else{
                res.send({
                    result : body
                })
            }
        })

    }catch(e){
        res.status(404).send({
            error : "There's an error"
        })
    }
})
module.exports = router;