// Yotube data API stuff here

console.log("This is javascript from the client side");
console.log("Sup bro how're you doing");

// Open AI stuff Below
const spinning = [
    {transform : "rotate(0) scale(0)"},
    {transform : "rotate(360deg) scale(1)"},
]

const spinningTiming = {
    duration : 1000,
    iterations : 1
}

const textArea = document.getElementById('area');
textArea.animate(spinning,spinningTiming);

const btn = document.getElementById("btn");
const btnImage = document.getElementById('btnImage');

btn.addEventListener('click' , (e) => {
    e.preventDefault();
    btnImage.src = "/img/loading.gif";
    const terms = document.getElementById("searchTerms");
    const requestTerms = {
        searchTerms : terms.value
    }
    console.log(requestTerms);
    fetch('/search', {     // Using the fetch function to send a 'POST' request to the server from the client here which is this js file
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'  // Setting the content type that is being sent to be JSON 
        },
        body: JSON.stringify(requestTerms)   // Here we are sending the 'requestbody JSON STRING' which consists of all the inputs that the user has given in the form and we are sending it via a 'POST' request using the 'fetch(...)' function
        }).then((response) => {
            response.json().then((data) => {    // Then we are recieving the error or success message using 'then and catch' functionality as the 'fetch(...)' function returns a promise
                if(data.error){     
                    console.log(data.error);
                }else{
                    btnImage.src = "/img/search.png";
                    console.log(data);
                    document.getElementById("dishName").textContent = data.name;
                    document.getElementById("area").textContent = "Ingridients : \n" + data.ingridients + "\nInstructions : \n\n" + data.instructions;
                    
                    // Another Fetch function for the youtube videos

                    const names = {
                        name :  document.getElementById("dishName").textContent = data.name
                    }

                    fetch('/ytsearch', {     // Using the fetch function to send a 'POST' request to the server from the client here which is this js file
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'  // Setting the content type that is being sent to be JSON 
                        },
                        body: JSON.stringify(names)   // Here we are sending the 'requestbody JSON STRING' which consists of all the inputs that the user has given in the form and we are sending it via a 'POST' request using the 'fetch(...)' function
                        }).then((response) => {
                            response.json().then((data) => {    // Then we are recieving the error or success message using 'then and catch' functionality as the 'fetch(...)' function returns a promise
                                if(data.error){
                                    console.log("Error in yotube request")
                                }else{
                                    const videos = document.getElementById("videos");
                                    videos.innerHTML = "";
                                    data.result.items.forEach((element) => {
                                        console.log(element.snippet.title);
                                        const video = `
                                            <iframe width="100%" height="315" src="http://www.youtube.com/embed/${element.id.videoId}" frameborder="0" allowfullscreen></iframe>
                                        `;
                                        videos.innerHTML = videos.innerHTML + video;
                                    })
                                }
                            })
                        }).catch((e) => {
                            console.log(e);
                        })







                }
            }).catch((e) => {
                console.log(e);
            })
        }).catch((e) => {
            console.log(e);
        })


})