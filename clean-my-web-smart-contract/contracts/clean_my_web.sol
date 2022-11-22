pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";
contract clean_my_web {
    event poped(Data data);
    
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

    mapping(address => Data[]) all_data;
    address[] private contributors;

    constructor() {
        owner = msg.sender; 
    }

    function change_owner(address newOwner) public {
        require(msg.sender == owner);
        owner = newOwner;
    }

    function get_owner() external view returns (address) {
        return owner;
    }

    function upload(Data memory data) public{
        arr.push(data);
        all_data[msg.sender].push(data);
        if (all_data[msg.sender].length == 1) {
            contributors.push(msg.sender);
        }
    }

    function pop() public {
        require(arr.length > 0, "index out of bound");
        require(msg.sender == owner);

        Data memory temp = arr[0];
        for (uint i = 0; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
        emit poped(temp);
    }

    function get_contribution(address user) public view returns(Data[] memory) {
        require(msg.sender == owner);
        return all_data[user];
    }
}