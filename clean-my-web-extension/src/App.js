import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row,Col,Container,Modal } from 'reactstrap'

import reportButtonImg from './images/report-button.png'
import uploadButtonImg from './images/upload-button.png'
import downloadButtonImg from './images/download-button.png'
import settingsButtonImg from './images/settings-button.png'
import { useState } from 'react';
import Web3 from 'web3'

import MetaMaskConnector from './components/MetaMaskConnector/MetaMaskConnector';
import AdvancedSettings from './components/AdvancedSettings/AdvancedSettings';

const App = () => {
  const [settingsOpen,setSettingsOpen] = useState(false)
  const toggleSettings = () => setSettingsOpen(!settingsOpen)

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const onPressConnect = async () => {
    setLoading(true);

    try {
      if (window?.ethereum?.isMetaMask) {
        // Desktop browser
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const account = Web3.utils.toChecksumAddress(accounts[0]);
        setAddress(account);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const onPressLogout = () => setAddress("");


  return (
    <>
    <Container className='main-popup'>
      <Row style={{textAlign:'center'}}>
        <h3>Clean my web</h3>
      </Row>
      <Row >
        <Col xs={4}>
            <img src={reportButtonImg} className='popup-button report-button'/>         
        </Col>
        <Col xs={8}>
          <div style={{alignItems:'center',display:'flex',height:'100%'}}>
            Add this site to filters
          </div>          
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <div className='popup-button'>
            <Row>
              <Col xs={12}>
                <img src={uploadButtonImg} className="upload-button data-button"/>
              </Col>
              <Col xs={12}>
                Upload Data
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={6}>
          <div className='popup-button'>
            <Row style={{height:'100%'}}>
              <Col xs={12}>
                <img src={downloadButtonImg} className="download-button data-button"/>
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
          {/* <Row className='popup-button'> */}
            <MetaMaskConnector
              onPressConnect={onPressConnect}
              onPressLogout={onPressLogout}
              loading={loading}
              address={address}
            />
          {/* </Row> */}


          <Row className='popup-button' onClick={toggleSettings}>
            <Col xs={3}>
              <img src={settingsButtonImg} className="advanced-button"/>
            </Col>
            <Col xs={9}>
              <div style={{alignItems:'center',display:'flex',height:'100%'}}>
                Advanced settings
              </div>
            </Col>
          </Row>
        </Col>

        <Col xs={1}></Col>
        
      </Row>

    </Container>
    <Modal isOpen={settingsOpen} toggle={toggleSettings}>
      <AdvancedSettings/>
    </Modal>
    </>
  );
}

export default App;
