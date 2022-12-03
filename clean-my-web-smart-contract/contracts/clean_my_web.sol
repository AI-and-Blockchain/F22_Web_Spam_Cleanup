pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";
contract clean_my_web {
    event dataEvent(uint index, string status, Data data);
    
    address private owner;

    struct Data {
        address contributor;
        uint created_time;
        // url string
        string[] url_list;
        // json like string
        string[] feature_extractor;
        // label for prediction
        uint[] labels;

        // TODO: add more descriptive meta data
    }

    Data[] private arr;

    // mapping(address => mapping(uint => Data)) public all_data;
    // mapping(address => uint[]) public contribution_times;
    // address[] public contributors;
    // uint[] public timestamps; 



    constructor() payable {
        owner = msg.sender; 
    }

    function change_owner(address newOwner) public {
        require(msg.sender == owner);
        owner = newOwner;
    }

    function get_owner() external view returns (address) {
        return owner;
    }

    function upload(Data memory data) external payable returns(uint){
        console.log(
            "Upload initiated",
            msg.sender
        );
        require(msg.value > 999, "you need to pay at least 1000 wei to upload new data");
        arr.push(data);
        emit dataEvent(arr.length,"received upload",data);
        return arr.length+1;
    }

    function download(uint start_idx) external payable returns(Data[] memory){
        console.log(
            "Download initiated",
            msg.sender
        );
        require(msg.value > (100 * arr.length - start_idx )- 1, "you need to pay at least 100 wei to download new data");
        require(start_idx < arr.length, "Start index out of bounds");
        Data[] memory dataSlice = new Data[](arr.length - start_idx);
        for(uint i = start_idx; i < arr.length; i++){
            (bool success,) = payable(address(arr[i].contributor)).call{value: 100}("");

            require(success,"failed to pay contributor");
            dataSlice[i-start_idx] = arr[i];
            emit dataEvent(arr.length,"successsfully paid contributor",arr[i]);
        }
        return dataSlice;
    }

    // delete everything. only owner can use
    function flush() external payable{
        require(msg.sender == owner);
    }
}


// ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 100000000, ["url2"], ["fe2"], [1]]