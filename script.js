let prompt=document.querySelector("#prompt");//id is mentioned with a #
let chatContainer=document.querySelector(".chat-container");//class is mentioned with a dot

//here we are accessing the image button
let imageBtn=document.querySelector("#image");

let imageInput=document.querySelector("#image input")

let image=document.querySelector("#image input");
//now we will be creating a function that will be used to create that element 
//basically createElement function and pass it the HTML we have selected along with the class
//this function can be used to create the user as well as ai chat boxes depending on the class name we pass


//this is the Api Url that we will be using we have decalared it as const because it will remain constant throughout

//const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GOOGLE_API_KEY" 

//so now we will have to have a API key of pur own and replace it with the last part that is 'Key' that was GOOGLE_API_KEY
//to get ur own API key go to the same gemini documentation and then Gemini Api Key and then Get APi key and then generate and then copy
const Api_Url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDnXoE20uGtWhLaIq25FRTId7E5kJUpJ0c" 



//we are making this object because we will store that what user has passed may it be a 
//message that is the text or the image
let user={
    message:null,
    file:{
        mime_type:null,
          data: null
    }//data is required in base 64 format , which converts the image to text

}

//here we are creating the generate Response function and nature of function would be 
//async because of timeout and respective responses

async function generateResponse(aiChatBox){

//this here is requestOption object that has the requirements met for the API call
    let requestOption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},//keep the header in curly braces and then also ake sure to apply 'key':'value'
        body:JSON.stringify({//we are just parsing using stringify
            "contents": [
                {"parts":[{"text": user.message},(user.file.data?[{inline_data:user.file}]:[])]}
            ]
        })
    }

    //now after we have the apiResponse coming we can integrate it the Ai=-chat-area
    let text=aiChatBox.querySelector(".ai-chat-area");

    //now we will be using the try catch block to handle any kind of errors from the API side
    try{
        //although the fetch function uses GET method but we need to do the POST as mentioned in the documentation   
        let response=await fetch(Api_Url,requestOption);//we introduced the variable requestOption
        //we are parsing the json data si that we can read it
        let data = await response.json();//we are using the await as async function and we have to wait till the API returns the response
        // console.log(data);
        let apiResponse=data.candidates[0].content.parts[0].text;
        console.log(apiResponse);

        text.innerHTML=apiResponse;
    }
    catch(error)
    {
        console.log(error);
    }
    finally{//we are using this function to implement auto scroll function in the AI chat area
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"});
        image.src=`img.svg`
        image.classList.remove('choose')
        user.file={}
    }
};

function createChatBox(html,classes){
    let div=document.createElement("div");
    div.innerHTML=html;
    div.classList.add(classes);
    return div;    
}

//here we are creating the function that will take the message in the prompt and integrate 
//it in the user chat box as we are gonna give it the HTML of that chat box 
function handleChatResponse(usermessage){

    user.message=usermessage;//putting the value of prompt in user.data

    //here we are giving the message the same HTML format as usr chat box


    let html=`<img src="user2.jpg"  id="userImage" width="50">
            <div class="user-chat-area">
                ${user.message}
                ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />` : ""}

            </div>`
    
    //clearing the response in the prompt area as it's been posted
    prompt.value=null;
    
    //now we will be creating a user chat box for that we will be using 
    //createChatBox function that will take the html for it's inner html and name of the class

    
    let userChatBox= createChatBox(html,"user-chat-area");

    // now we will append the userChatBox which was created and returned, in the chat container 
    chatContainer.appendChild(userChatBox);

    //here we are using scroll function for auto scrolling 
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

    //let's now create a AI response 
    setTimeout(()=>{
        let htmlAI=`<img src="chatbot.jpg" id="aiImage" width="55">
        <div class="ai-chat-area">
        <img src="loading.webp" alt="" class="load" width="50px">
        </div>`
        let aiChatBox=createChatBox(htmlAI,"ai-chat-area");
        chatContainer.appendChild(aiChatBox);

        //here he are passing the aiChatBox to generateResponse function which will have a 
        //gemini api to generate the response
        generateResponse(aiChatBox);
    },600)
    

}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=='Enter'){

        //checking if the user press enter then the value in the prompt area gets printed

        // console.log(prompt.value);

        //creating a function which will take message in the chat area and integrate it
        //in the user chat box

        handleChatResponse(prompt.value);
        
    }
})


//adding image as prompt 
imageInput.addEventListener("change",()=>{
    const file=imageInput.files[0];
    if(!file) return;
    let reader=new FileReader()
    reader.onload=(e)=>{
        // console.log(e);
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data: base64string
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
    reader.readAsDataURL(file);
})

//here we are adding the eventListener on that image button so that we are able to upload an image
imageBtn.addEventListener("click",()=>{
    imageBtn.querySelector("input").click()
})