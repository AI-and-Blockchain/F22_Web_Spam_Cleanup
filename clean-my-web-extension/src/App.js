/*global chrome*/

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Modal } from 'react-bootstrap'

import reportButtonImg from './images/report-button.png'
import uploadButtonImg from './images/upload-button.png'
import downloadButtonImg from './images/download-button.png'
import settingsButtonImg from './images/settings-button.png'
import { useEffect, useState } from 'react';
// import { web3,web3Provider } from './metamask-provider';
// import MetaMaskConnector from './components/MetaMaskConnector/MetaMaskConnector';
import AdvancedSettings from './components/AdvancedSettings/AdvancedSettings';
import ThresholdSlider from './components/ThresholdSlider/ThresholdSlider';
// import {useChromeStorageLocal} from 'use-chrome-storage';

const initialStorage = {
	weights: [0, 0, 0, 1],
	features: [
		{
			type: 'count',
			from: '',
			in: 'url'
		}
	],
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
		// {...newStorage,...res}
		console.log('update storage')
		// setChromeStorage({...initialWeights,...initialFeatures,...initialSettings,...res,})

		chrome.storage.local.set(newStorage).then(() => {
			console.log(newStorage)
			setChromeStorage(newStorage)
			if(newStorage.settings.autoReload && reload) reloadTabs()
		})
		setChromeStorage(newStorage)

	}

	useEffect(() => {
		console.log('we read from chrome!')
		chrome.storage.local.get(['weights', 'settings', 'features'])
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
	}, [])



	// const [value, setValue, isPersistent, error] = useChromeStorageLocal('weights', []);


	// const onPressConnect = async () => {
	//   setLoading(true);
	//   console.log('we try connect')
	//   console.log(window)
	//   try {
	//     web3Provider.request({ 
	//       method: 'eth_requestAccounts' 
	//     }).then(
	//       () => {
	//         web3
	//         .eth
	//         .getAccounts()
	//         .then(accounts => {
	//           if (accounts && accounts.length) {
	//             setAddress(accounts[0])
	//             console.log(accounts[0])
	//             console.log('wow!')
	//           } else {
	//             setAddress("")
	//           }
	//         })
	//       }
	//     )
	//   } catch (error) {
	//     console.log('did not work..')
	//     console.log(error);
	//   }

	//   setLoading(false);
	// };

	const onPressLogout = () => setAddress("");


	const onPressReport = () => {
		let w = chromeStorage.weights;
		w[0] = w[0] + 1
		// chrome.storage.local.set({weights: w})
		syncChromeStorage({ ...chromeStorage, weights: w })
	}

	const onThresholdChange = newThreshold => {
		// let settings = res.settings
		// settings.threshold = newThreshold
		// chrome.storage.local.set({settings: {...res.settings,threshold:newThreshold}})
		syncChromeStorage({ ...chromeStorage, settings: { ...chromeStorage.settings, threshold: newThreshold } })

	}

	console.log('App render!')

	return (
		<>
			<Container className='main-popup'>
				<Row style={{ textAlign: 'center' }}>
					<h3>Clean my web</h3>
				</Row>
				weights: {chromeStorage !== null ? chromeStorage.weights + JSON.stringify(chromeStorage.features) : 'not yet!'}
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
									<img src={uploadButtonImg} className="upload-button data-button" />
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
									<img src={downloadButtonImg} className="download-button data-button" />
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
						{/* <MetaMaskConnector
              onPressConnect={onPressConnect}
              onPressLogout={onPressLogout}
              loading={loading}
              address={address}
            /> */}
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
