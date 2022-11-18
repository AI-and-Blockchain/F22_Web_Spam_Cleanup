

const MetaMaskConnector = ({
    onPressLogout,
    onPressConnect,
    loading,
    address,
}) => {
    return (
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
    );
  };

export default MetaMaskConnector