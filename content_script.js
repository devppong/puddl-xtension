// Wait for the page to finish loading
window.addEventListener('load', () => {
  // Select all input fields and textareas on the page
  const inputs = document.querySelectorAll('input[type="text"], textarea');

  // Add event listeners to each input field
  inputs.forEach(input => {
    let timeout = null;
    let previousStringComputed = null;
    // Keep track of the previously focused input field
    let previousInput = null;
    // Keep track of the currently open popup
    let openPopup = null;
    input.addEventListener('focus', () => {
      // Set the previously focused input field to the current input field
      previousInput = input;
    });
    input.addEventListener('input', () => {
      let generatedPrompt = null;
      let tooltipResponse = null;
      // Clear the previous timeout
      clearTimeout(timeout);
      // Set a new timeout
      timeout = setTimeout(() => {
        // Check if the input value starts with "opt:"
        if (previousStringComputed != input.value && input.value!="") {
          previousStringComputed = input.value
          const popup = document.createElement('div');
          // popup.textContent = 'Hello world!';
          popup.style.position = 'absolute';
          // popup.style.bottom = input.getBoundingClientRect().top - input.getBoundingClientRect().height + 'px';
          popup.style.left = input.getBoundingClientRect().left + 'px';
          popup.style.zIndex = '999'; // Ensure that the popup is visible
          popup.style.color = 'black';
          popup.style.background = 'white';
          popup.style.padding = '10px';
          popup.style.maxWidth = Number(input.getBoundingClientRect().width * 0.8) + 'px';
          popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
          // Create the header element
          const header = document.createElement('h3');
          header.textContent = 'Optimised Output :';
          header.style.fontWeight = 'bold';

          // Create the subheader element
          const subheader = document.createElement('h4');
          subheader.textContent = "Your improved prompt is loading...."
          // if (subheader.textContent.length > 30) {
          //   subheader.textContent = subheader.textContent.substring(0, 25) + '...';
          // }
          subheader.style.marginBottom = '10px';
          subheader.style.whiteSpace = 'nowrap'; // Prevent line breaks
          subheader.style.overflow = 'hidden'; // Hide overflow
          subheader.style.textOverflow = 'ellipsis'; // Add ellipsis if text overflows

          // Create the replace button element
          const replaceButton = document.createElement('button');
          replaceButton.textContent = 'Replace';
          // replaceButton.style.display = 'block';
          replaceButton.style.marginBottom = '10px';
          replaceButton.style.marginRight = '10px';
          replaceButton.style.padding = '4px';
          replaceButton.style.borderRadius = '4px';
          replaceButton.style.disabled = generatedPrompt == null
          replaceButton.className = 'replace-button';

                    // Create a loader
                    const loader = document.createElement('div');
                    loader.id = 'loader';
                    loader.style.display = 'none';

          // Create the learn more link element
          const learnMoreLink = document.createElement('a');
          learnMoreLink.textContent = 'Powered by puddl.io';
          learnMoreLink.href = 'https://puddl.io';
          learnMoreLink.style.display = 'block';
          learnMoreLink.style.fontSize = '12px'

          // Create the dismiss button element
          const dismissButton = document.createElement('button');
          dismissButton.textContent = 'Dismiss';
          dismissButton.style.marginRight = '10px'
          dismissButton.style.padding = '4px';
          dismissButton.style.borderRadius = '4px';
          dismissButton.className = 'dismiss-button'; // Add the "dismiss-button" class to the button
          // dismissButton.style.display = 'block';

          // Add an event listener to the dismiss button that removes the popup when clicked
          dismissButton.addEventListener('click', () => {
            popup.remove();
            if (previousInput) {
              previousInput.focus(); // Move the cursor back to the previous input field
            }
          });

          // Add an event listener to the replace button that replaces the input value when clicked
          replaceButton.addEventListener('click', () => {
            if (generatedPrompt != null) {
              input.value = generatedPrompt
            }
            // const inputValue = input.value.substring(4); // Get the input value without the "opt:" prefix
            // input.value = 'Hello world ' + inputValue; // Replace the input value
            popup.remove(); // Remove the popup
            if (previousInput) {
              previousInput.focus(); // Move the cursor back to the previous input field
            }
          });


          // Tooltip
          const tooltip = document.createElement('div');
          // tooltip.innerHTML = resp; // Set the innerHTML of the tooltip element to the tooltip returned by the API
          // tooltip.style.marginBottom = '10px';
          tooltip.style.display = 'inline-block';
          tooltip.style.position = 'relative';
          tooltip.style.marginLeft = '10px'

          const tooltipIcon = document.createElement('div');
          tooltipIcon.innerHTML = '&#9432;'; // Set the innerHTML of the tooltip icon to the Unicode character for a tooltip icon
          tooltipIcon.style.display = 'inline-block';
          tooltipIcon.style.top = '50%';
          // tooltipIcon.style.top = '-10px';
          // tooltipIcon.style.right = '0px';
          tooltipIcon.style.fontSize = '15px';

          // Append the elements to the popup
          popup.appendChild(header);
          popup.appendChild(subheader);
          popup.appendChild(replaceButton);
          popup.appendChild(dismissButton);
          popup.append(loader);
          popup.appendChild(tooltip);
          popup.appendChild(learnMoreLink);
          popup.style.top = input.getBoundingClientRect().top - input.getBoundingClientRect().height - 140 + 'px';
          if (openPopup) {
            openPopup.remove();
          }
          var data = {
            prompt: input.value
          }
          loader.style.display = 'inline-block';

          chrome.runtime.sendMessage({ type: 'makePostRequest', url: 'https://gpt-4-prompt-optim.kartheekakella.repl.co/optimize', data: data }, function (response) {
            console.log("response")
            console.log(response)
            loader.style.display = 'none';
            if (response == null) {
              // generatedPrompt = "There was an error processing, please try again",
              subheader.textContent = "There was an error, please keep typing/refresh to retry"
            } else {
              subheader.textContent = response.final_prompt
              generatedPrompt = response.final_prompt
              tooltipResponse = response.tooltip
            }
            if(tooltipResponse!='<div></div>'&& tooltipResponse!=null){
              tooltipIcon.addEventListener('mouseover', () => {
                const tooltipContent = document.createElement('div');
                tooltipContent.innerHTML = tooltipResponse; // Set the innerHTML of the tooltip content to the tooltip returned by the API
                tooltipContent.style.position = 'absolute';
                tooltipContent.style.bottom = '20px'; // Change the bottom position to display the tooltip content on top of the tooltip icon
                tooltipContent.style.left = '0px';
                tooltipContent.style.background = '#3E3F4B';
                tooltipContent.style.color = '#ECECF1';
                tooltipContent.style.padding = '10px';
                tooltipContent.style.width = '300px';
                tooltipContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
                tooltip.appendChild(tooltipContent);
              });
              // Add an event listener to the tooltip icon that hides the HTML content of the tooltip when the mouse is moved away from the icon
              tooltipIcon.addEventListener('mouseout', () => {
                tooltip.removeChild(tooltip.lastChild);
              });
            }
            tooltip.appendChild(tooltipIcon); // Add the tooltip icon element to the tooltip
            // Add an event listener to the tooltip icon that shows the HTML content of the tooltip on hover
            // tooltipIcon.addEventListener('mouseover', () => {
            //   const tooltipContent = document.createElement('div');
            //   tooltipContent.innerHTML = tooltipResponse; // Set the innerHTML of the tooltip content to the tooltip returned by the API
            //   tooltipContent.style.position = 'absolute';
            //   // tooltipContent.style.top = '20px';
            //   tooltipContent.style.right = '0px';
            //   tooltipContent.style.background = 'white';
            //   tooltipContent.style.color = 'black';
            //   tooltipContent.style.padding = '10px';
            //   tooltipContent.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            //   tooltip.appendChild(tooltipContent);
            // });
          });
          document.body.appendChild(popup)
          // Make a POST request to the API and set the subheader text to the response
          // chrome.runtime.getBackgroundPage(function(backgroundPage) {
          //   const request = new XMLHttpRequest();
          //   request.open('POST', 'https://gpt-4-prompt-optim.kartheekakella.repl.co/optimize');
          //   request.setRequestHeader('Content-Type', 'application/json');
          //   request.onreadystatechange = () => {
          //     if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          //       const data = JSON.parse(request.responseText);
          //       subheader.textContent = data.final_prompt;
          //       document.body.appendChild(popup)
          //     }
          //   };
          //   request.send(JSON.stringify({
          //     prompt: input.value.substring(4)
          //   }));
          // })
          openPopup = popup;
        }
      }, 2000); // Wait for 2 seconds after the last input event
    });
  });
});