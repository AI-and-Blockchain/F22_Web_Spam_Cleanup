/*global chrome*/

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Modal, Button } from 'react-bootstrap'

import settingsButtonImg from './images/settings-button.png'
import { useEffect, useState } from 'react';
import { web3, web3Provider } from './metamask-provider';
import AdvancedSettings from './components/AdvancedSettings/AdvancedSettings';
import ThresholdSlider from './components/ThresholdSlider/ThresholdSlider';

import contractData from './abi/clean_my_web.json'

const contractAddress = '0x287623Adf0541D90342ed62C31660b6DF3C8165a'


const initialStorage = {
	model: { bias: 0, weights: [0, 0, 0, 1] },
	offline: {
		features: [
			{
				"name": "countList1FromSource",
				"operation": "count",
				"target": "source",
				"data": "https://gist.githubusercontent.com/inwonakng/c9fb4978664455f467540acd3452fff1/raw/d3c006e02babe0a2efadb5a73d0b942cd79fba19/samplefilter1.json"
			}, {
				"name": "countList2FromSource",
				"operation": "count",
				"target": "source",
				"data": "https://gist.githubusercontent.com/inwonakng/3713e2e2c7fce34c5670056f5aa62ea9/raw/e2123c01f5c1426bb9ef39fdc0683deaf5d22144/samplefilterscript.json"
			}, {
				"name": "urlLength",
				"operation": "length",
				"target": "url",
				"data": ""
			}, {
				"name": "countList3FromURL",
				"operation": "count",
				"target": "url",
				"data": [".", "/", "-", "_"]
			}, {
				"name": "countNumFromURL",
				"operation": "count",
				"target": "url",
				"data": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
			}
		],
		urls: [],
		labels: [],
	},
	online: {
		features: [],
		urls: [],
		labels: [],
	},
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
		console.log(newStorage)
		chrome.storage.local.set(newStorage).then(() => {
			console.log(newStorage)
			setChromeStorage(newStorage)
			if(newStorage.settings.autoReload && reload) reloadTabs()
		})
		setChromeStorage(newStorage)
	}

	/************METAMASK STUFF*************/

	const onPressLogout = () => setAddress('')

	const onPressConnect = async () => {
	  setLoading(true);
	  console.log('we try connect')
	  console.log(window)

	  if(address!=='') return;
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

	// const onPressLogout = () => setAddress("");

	const smartContract = new web3.eth.Contract(contractData.abi,contractAddress)

	const onPressReport = () => {
		chrome.tabs.query({active:true,currentWindow:true}).then(
			tabs => {
				console.log(`reporting ${tabs[0].url}`)
				syncChromeStorage({ 
					...chromeStorage, 
					offline: {
						...chromeStorage.offline, 
						urls: [
							...chromeStorage.offline.urls,
							tabs[0].url
						]
					} 
				})
			}
		)
	}

	const onPressUpload = async () => {
		try {
			console.log('we first consult server')
			fetch(
				'http://localhost:5000/verify', {
					method: 'POST',
					headers: {"Content-Type": "application/json"},
					body:JSON.stringify(chromeStorage.offline)
				}
			).then(r => {
				console.log('got server response!')
				console.log('we try upload anyways...')


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


					syncChromeStorage(
						{
							...chromeStorage,
							offline : initialStorage.offline,
							online: {
								urls: [
									...chromeStorage.online.urls,
									...chromeStorage.offline.urls
								],
								features: [
									...chromeStorage.online.features,
									...chromeStorage.offline.features
								],
								labels: [
									...chromeStorage.online.labels,
									...chromeStorage.offline.labels
								]
							}
						}
					)
				})
			})
		} catch (error) {
			console.log('did not work..')
			console.log(error);
		}
	}



	const onPressDownload = async () => {
		try {
			console.log('we try download')
			smartContract.methods.download([
				chromeStorage.offline.urls.length
			]).send({
				from: address,
				value: 1000
			}).then((receipt) =>{
				console.log('Downloaded!!!!')
				console.log(receipt)
				console.log(receipt.events.dataEvent.map(e=>e.returnValues.data))
				const newData = receipt.events.dataEvent.map(e=>e.returnValues.data)
				let onlineData = chromeStorage.online
				newData.forEach(data => {
					onlineData = {
						urls: [...onlineData.urls,data[2]],
						features: [...onlineData.features,data[3]],
						labels: [...onlineData.labels,data[4]]
					}
				})
				syncChromeStorage({
					...chromeStorage,
					online: onlineData
				})

			})
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
			<Container>
				<Row className="text-center pt-2">
					<h3>Clean my web</h3>
				</Row>
				<Row className="p-2">
					<Button
					onClick={onPressReport} 
					variant="warning"
					>
						Add this site to filters
					</Button>
				</Row>
				<Row>
					<Col xs={6} className="p-2">
						<Button 
						variant="outline-primary"
						style={{width:'100%'}}
						onClick={onPressUpload}
						>
							Upload
						</Button>
					</Col>
					<Col xs={6} className="p-2">
						<Button
						variant="outline-danger"
						style={{width:'100%'}}
						onClick={onPressDownload}
						>
							Download
						</Button>
					</Col>
				</Row>
				<Row className="p-2">
					{address === '' ?
					<Button
						disabled={loading}
						onClick={onPressConnect}
						variant='primary'
					>
						Connect Metamask!
					</Button>
					:
					<Button
						disabled={loading}
						onClick={onPressLogout}
						variant='info'
					>
						Connected!
					</Button>
					}
				</Row>
				<Row
				className="p-2">
					<ThresholdSlider
						initialThreshold={
							chromeStorage !== null
								? chromeStorage.settings.threshold
								: 0
						}
						onThresholdChange={onThresholdChange} 
						// onThresholdChange={() => { }}
					/>

				</Row>

				<Row className='p-2 popup-button'
				onClick={toggleSettings}
				>
					<Col xs={3}>
						<img src={settingsButtonImg} className="advanced-button" />
					</Col>
					<Col xs={9}>
						<div style={{ alignItems: 'center', display: 'flex', height: '100%' }}>
							Advanced settings
						</div>
					</Col>
				</Row>
				<Row>

				</Row>

			</Container>
			<AdvancedSettings settingsOpen={settingsOpen} toggleSettings={toggleSettings} />

		</>
	);
}

export default App;
