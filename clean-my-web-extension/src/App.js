/*global chrome*/

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Modal } from 'react-bootstrap'

import reportButtonImg from './images/report-button.png'
import uploadButtonImg from './images/upload-button.png'
import downloadButtonImg from './images/download-button.png'
import settingsButtonImg from './images/settings-button.png'
import { useEffect, useState } from 'react';
import { web3, web3Provider } from './metamask-provider';
import MetaMaskConnector from './components/MetaMaskConnector/MetaMaskConnector';
import AdvancedSettings from './components/AdvancedSettings/AdvancedSettings';
import ThresholdSlider from './components/ThresholdSlider/ThresholdSlider';

import contractData from './abi/clean_my_web.json'



const contractAddress = '0x3Ac8B3249403c2AF7951860C1f7017F1f61c7084'



// const data = '0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e00000000000000000000000000000000000000000000000000000000000000120000000000000000000000000000000000000000000000000000000000000016000000000000000000000000000000000000000000000000000000000000001a0000000000000000000000000000000000000000000000000000000000000000c496c2056696e6369746f72650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b3535353535353535353536000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000336363600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000013600000000000000000000000000000000000000000000000000000000000000';



// const decodedParameters = 

// {
// 	"blockHash": "0xa27fd24c036d8404661e4827fbc49c1fc6d7e50db2bf494e7529710da2a80887",
// 	"blockNumber": 8065922,
// 	"contractAddress": null,
// 	"cumulativeGasUsed": 1546852,
// 	"effectiveGasPrice": 2500000018,
// 	"from": "0x51441fd4acaccc9bda38178244c13f1e4d1367bd",
// 	"gasUsed": 238822,
// 	"logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000",
// 	"status": true,
// 	"to": "0xeda14412edfead0ffa079c3f0a30d668acbc840f",
// 	"transactionHash": "0x5c4561610f4aa2a9a61ce876d427e0df39fedfb89ca464e6451d9d81761be58f",
// 	"transactionIndex": 9,
// 	"type": "0x2",
// 	"events": {
// 		"0": {
// 			"address": "0xeDA14412EDfeAd0FFa079C3f0a30D668AcbC840F",
// 			"blockHash": "0xa27fd24c036d8404661e4827fbc49c1fc6d7e50db2bf494e7529710da2a80887",
// 			"blockNumber": 8065922,
// 			"logIndex": 4,
// 			"removed": false,
// 			"transactionHash": "0x5c4561610f4aa2a9a61ce876d427e0df39fedfb89ca464e6451d9d81761be58f",
// 			"transactionIndex": 9,
// 			"id": "log_7c427917",
// 			"returnValues": {},
// 			"signature": null,
// 			"raw": {
// 				"data": "0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000000f72656365697665642075706c6f6164000000000000000000000000000000000000000000000000000000000051441fd4acaccc9bda38178244c13f1e4d1367bd00000000000000000000000000000000000000000000000000000184d75d266d00000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000475726c3100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003666531000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
// 				"topics": [
// 					"0x4231f248c058b000b783a771f6e89723a6588d06ce65e17ab8937c3f456fb9e9"
// 				]
// 			}
// 		}
// 	}
// }

const initialStorage = {
	weights: [0, 0, 0, 1],
	syncedFeatures: [
		{
			type: 'count',
			from: '',
			in: 'url'
		}
	],
	offlineFeatures: [],
	syncedURLs: [],
	offlineURLs: [],
	settings: {
		threshold: 3,
		autoReload: true,
	}
}


const App = () => {
	const [settingsOpen, setSettingsOpen] = useState(false)
	const toggleSettings = () => setSettingsOpen(!settingsOpen)

	const [loading, setLoading] = useState(false);
	const [address, setAddress] = useState("");

	const [chromeStorage, setChromeStorage] = useState(initialStorage);
	// const [settings,setSettings] = useState([])
	const reloadTabs = () => {
		console.log('we reload?')
		chrome.tabs.query(
			{ url: 'https://www.google.com/search*' },
			tabs => {
				tabs.forEach(tab => {
					console.log(`this tab? ${tab.id}`)
					chrome.tabs.reload(tab.id)
				})
			}
		)
	}

	const syncChromeStorage = (newStorage,reload=true) => {
		console.log('update storage')
		chrome.storage.local.set(newStorage).then(() => {
			console.log(newStorage)
			setChromeStorage(newStorage)
			if(newStorage.settings.autoReload && reload) reloadTabs()
		})
		setChromeStorage(newStorage)
	}

	// METAMASK STUFF

	const onPressConnect = async () => {
	  setLoading(true);
	  console.log('we try connect')
	  console.log(window)
	  try {
	    web3Provider.request({ 
	      method: 'eth_requestAccounts' 
	    }).then(
	      () => {
	        web3
	        .eth
	        .getAccounts()
	        .then(accounts => {
				if (accounts && accounts.length) {
					setAddress(accounts[0])
					console.log(accounts)
					web3.eth.getBalance(accounts[0]).then(b => console.log('balance',b))
				} else {
					setAddress("")
				}
	        })
		})
	  } catch (error) {
	    console.log('did not work..')
	    console.log(error);
	  }

	  setLoading(false);
	};

	const onPressLogout = () => setAddress("");

	const smartContract = new web3.eth.Contract(contractData.abi,contractAddress)
	
	const decodeOutput = receipt => 
	Object.keys(receipt.events.dataEvent).map(k=>
		web3.eth.abi.decodeParameters(contractData.abi[1].inputs[1].components, receipt.events[k].raw.data)
	)

	const onPressReport = () => {
		let w = chromeStorage.weights;
		w[0] = w[0] + 1
		syncChromeStorage({ ...chromeStorage, weights: w })
	}

	const onPressUpload = () => {
		try {
			console.log('we try upload')
			smartContract.methods.upload([
				address, 
				(new Date().getTime()), 
				["url1"], 
				["fe1"], 
				[1]
			]).send({
				from: address,
				value: 1000
			}).then((receipt) =>{
				console.log('woohoo!')
				console.log(receipt)
				console.log(receipt.events.dataEvent.returnValues.data)
				// console.log(decodeLogs(receipt))
				// syncChromeStorage(
				// 	{
				// 		...chromeStorage,
				// 		urlList: [...chromeStorage,...]
				// 	}
				// )
			})
			
			
			// )
		} catch (error) {
			console.log('did not work..')
			console.log(error);
		}
	}



	const onPressDownload = () => {
		try {
			console.log('we try download')
			smartContract.methods.download([
				chromeStorage.syncedURLs.length
			]).send({
				from: address,
				value: 1000
			}).then((receipt) =>{
				console.log('Downloaded!!!!')
				console.log(receipt)
				console.log(receipt.events.dataEvent.map(e=>e.returnValues.data))
			})
			
			// )
		} catch (error) {
			console.log('did not work..')
			console.log(error);
		}
	}

	const onThresholdChange = newThreshold => {
		syncChromeStorage({ ...chromeStorage, settings: { ...chromeStorage.settings, threshold: newThreshold } })

	}


	// Stuff to run in startup
	useEffect(() => {
		console.log('we read from chrome!')
		chrome.storage.local.get(Object.keys(initialStorage))
			.then(res => {
				syncChromeStorage(
					Object.keys(res).length === 0
					// if starting fresh, we just use inital values
					? chromeStorage
					// fill in blank with initial settings, and use cache
					: {...chromeStorage,...res},
					false
				)
			})
		
		onPressConnect().then(() => console.log('metamask auto login success'))
		
	}, [])

	console.log('App render!')

	return (
		<>
			<Container className='main-popup'>
				<Row style={{ textAlign: 'center' }}>
					<h3>Clean my web</h3>
				</Row>
				<Row >
					<Col xs={4}>
						<img src={reportButtonImg} className='popup-button report-button' onClick={onPressReport} />
					</Col>
					<Col xs={8}>
						<div style={{ alignItems: 'center', display: 'flex', height: '100%' }}>
							Add this site to filters
						</div>
					</Col>
				</Row>
				<Row>
					<Col xs={6}>
						<div className='popup-button'>
							<Row>
								<Col xs={12}>
									<img src={uploadButtonImg} className="upload-button data-button" onClick={onPressUpload}/>
								</Col>
								<Col xs={12}>
									Upload Data
								</Col>
							</Row>
						</div>
					</Col>
					<Col xs={6}>
						<div className='popup-button'>
							<Row style={{ height: '100%' }}>
								<Col xs={12}>
									<img src={downloadButtonImg} className="download-button data-button" onClick={onPressDownload}/>
								</Col>
								<Col xs={12}>
									Download Data
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
				<Row>
					<Col xs={1}></Col>
					<Col xs={10}>
						<MetaMaskConnector
							onPressConnect={onPressConnect}
							onPressLogout={onPressLogout}
							loading={loading}
							address={address}
						/>

						<Row className=''>



							<ThresholdSlider
								initialThreshold={
									chromeStorage !== null
										? chromeStorage.settings.threshold
										: 0
								} onThresholdChange={onThresholdChange} />

						</Row>

						<Row className='popup-button' onClick={toggleSettings}>
							<Col xs={3}>
								<img src={settingsButtonImg} className="advanced-button" />
							</Col>
							<Col xs={9}>
								<div style={{ alignItems: 'center', display: 'flex', height: '100%' }}>
									Advanced settings
								</div>
							</Col>
						</Row>
					</Col>

					<Col xs={1}></Col>

				</Row>

			</Container>
			<AdvancedSettings settingsOpen={settingsOpen} toggleSettings={toggleSettings}/>
			
		</>
	);
}

export default App;
