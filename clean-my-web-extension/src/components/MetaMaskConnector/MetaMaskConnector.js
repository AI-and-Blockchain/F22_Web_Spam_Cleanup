

const MetaMaskConnector = ({
    onPressLogout,
    onPressConnect,
    loading,
    address,
}) => {
    return (
      <>
      <div style={{textAlign:'center'}}>
      {address && !loading ? address.slice(0,10)+'...'+ address.slice(address.length-10): ''}
      </div>
      <div className='metamask-button'>
        {address && !loading ? (
          <button onClick={onPressLogout} className="connect-wallet">
            Disconnect
          </button>
        ) : loading ? (
          <button
          className="connect-wallet connect-button-loading"
          disabled
          >
            <div>Loading...</div>
          </button>
        ) : (
          <button onClick={onPressConnect} className="connect-wallet">
            Connect Metamask
          </button>
        )}
      </div>
      </>
    );
  };

export default MetaMaskConnector