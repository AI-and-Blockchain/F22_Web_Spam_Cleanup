
const createElement = (tag,args = {},children = []) => {
    let el = document.createElement(tag);
    for(attr in args){
        if(typeof args[attr] === 'object'){
            
            for(p in args[attr]){
                el[attr][p] = args[attr][p]
            }
        }else{
            el[attr] = args[attr]
        }
    }
    children.forEach(c => el.append(c))
    return el
}



const togglePopup = e => {
    if(e.target.nextElementSibling.className.includes('popup-hidden')){
        e.target.nextElementSibling.classList.remove('popup-hidden')
        e.target.nextElementSibling.classList.add('popup-visible')
    }else{
        e.target.nextElementSibling.classList.remove('popup-visible')
        e.target.nextElementSibling.classList.add('popup-hidden')
    }
}


const getPrediction = (weights,header) => {
    let url = header.parentElement.href

    let resultBox = header.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    if(url === undefined) return [resultBox,null]
    let prediction = {
        global: url.includes('trailblazer.me') ? 8 : 2,
    }

    return [resultBox, prediction]
}

const predictionOutput = [
    'Trusted',
    'Trusted',
    'Trusted',
    'Trusted',
    'Trusted',
    'Fishy',
    'Fishy',
    'Fishy',
    'Fishy',
    'Fishy',
]


chrome.storage.local.get(['weights','settings','features']).then(res => {
    // let featureBuilders = res.features
    document.querySelectorAll('h3').forEach(header => {
        let [resultBox,prediction] = getPrediction(res.weights,header)
        if(prediction === null) return

        if( prediction.global > 9-res.settings.threshold ){
            header.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
            return
        }

        let resultPopup = createElement('div',{className: 'result-container'},[
            createElement(
                'div',{
                className:`button result-popup-btn prediction-${prediction.global}`,
                onclick: togglePopup,
                textContent: predictionOutput[prediction.global]
            }), 
            createElement(
                'div',{
                    className:'result-popup popup-hidden'
                },[
                createElement(
                    'table',{className:'table'},
                    [createElement(
                        'tr', {
                            className: 'prediction-row',
                        },[
                        createElement(
                            'td', {className:'',textContent:'Category',style:{width: '50%',fontWeight:'bold'}}),
                        createElement(
                            'td', {className:'',textContent:'Likelihood',style:{fontWeight:'bold'}}),
                        ]
                    ) ,...Object.keys(prediction).map(pred => 
                    createElement(
                        'tr', {
                            className: 'prediction-row',
                        },[
                        createElement(
                            'td', {className:'',textContent:pred,style:{width: '30%'}}),
                        createElement(
                            'td', {className:'',textContent:`${prediction[pred] * 10}%`}),
                        ]
                    ))]
                )]
            )
        ])

        // // if there is more than 1 clickable int the result, we need to move it out of the way
        let links = resultBox.querySelectorAll('a')
        if(links.length > 1){
            links[1].parentElement.parentElement.style['marginTop'] = '30px'
        }

        
        resultBox.style.display='flex'
        resultBox.append(resultPopup)
    })    
})





// const injectScript = chrome.runtime.getURL("injected.js");

// let script = document.createElement('script')
// script.src = injectScript
// document.body.append(script)



// chrome.storage.local.get(['weights','settings','features']).then(res => {
//     console.log(res)

// })