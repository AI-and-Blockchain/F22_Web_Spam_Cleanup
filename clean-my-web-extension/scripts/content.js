// alert('hey there!')

let headings = [...document.getElementsByTagName('h3')]

const createModal = () =>{
    let modal = document.createElement('div')
    modal.className = 'result-menu'
    // modal.setAttribute(
    //     'style',
    //     'border: 2px solid red;width: 30%;float:right; display: block;'
    // )
    // modal.textContent = 'Modal button' 

    let reportMenu = document.createElement('div')
    reportMenu.textContent = 'Report Menu'
    reportMenu.className = 'report-menu hidden'
    // reportMenu.setAttribute(
    //     'style',
    //     'display: none; 2px solid red;',
    // )

    let reportButton = document.createElement('button')
    reportButton.textContent = 'Report site'
    reportButton.addEventListener(
        'click',
        () => {
            // alert('you clicked me!');
            // alert(reportMenu.style)
            reportMenu.className = (
                reportMenu.className.includes('hidden') 
                ?'report-menu displayed' 
                :'report-menu hidden'
            )
            
        }
    )

    modal.appendChild(reportButton)
    modal.appendChild(reportMenu)

    return modal
}

const addModal = (heading) => {
    if(
        (heading.textContent.includes('Videos'))
        || (heading.textContent.includes('Images For'))
    ) return;
    // alert('dude?')

    let resultdiv = heading.parentElement.parentElement
    let actualResult = resultdiv.childNodes[0]
    resultdiv.setAttribute(
        'style',
        'display: flex; flex-direction: row;'
    )
    actualResult.setAttribute(
        'style',
        'width: 70%; float: left; display: block;'
    )

    
    
    // return `<b></b>`
    // return modal
    resultdiv.appendChild(createModal())
}

headings.forEach(addModal)
// add_modal(headings[0])


// headings.forEach(
//     (heading,i) => headings

// )



// (async () => {
//     const results = await Promise.all(urls.map(processUrl));
//     console.log(results);
//     // further processing must be also inside this IIFE
//   })();

// const processUrl = async (url) => {
//     try {
//       const text = await (await fetch(url)).text();
//       return {url, text, status: detecting(text)};
//     } catch (error) {
//       return {url, error};
//     }
// }
