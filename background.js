chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.type === 'makePostRequest') {
        fetch(request.url, {
            method: 'POST',
            body: JSON.stringify(request.data),
            headers: {
              'Content-Type': 'application/json'
            }
          })
            .then(function(response) {
                console.log("response from backgroundjs")
                console.log(response)
                if(response.status == 200){
                    return response.json();
                }else{
                    {
                        final_prompt:"Server error please try again"
                    }
                }
            })
            .then(function(responseData) {
              sendResponse(responseData);
            });
          return true;
        // const request = new XMLHttpRequest();
        // request.open('POST', request.url);
        // request.setRequestHeader('Content-Type', 'application/json');
        // request.onreadystatechange = () => {
        //     if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        //         const data = JSON.parse(request.responseText);
        //         console.log(data)
        //         sendResponse(data)
        //     }
        // };
        // request.send(JSON.stringify(request.data));
        // return true
    }
});