import { Modal } from 'react-bootstrap'
const AdvancedSettings = ({settingsOpen,toggleSettings}) => {
    return(
        <Modal show={settingsOpen} onHide={toggleSettings}>
            I am settings
        <div className='advanced-settings'>
        </div>
        </Modal>
    )
}

export default AdvancedSettings;