// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.26;

contract EqualSplit {
    uint256 public totalAmount;
    
    mapping (address=>bool) public user;
    address[] public members;
    uint256 public totalPeople;
    address public admin;

    constructor(){
        admin = msg.sender;
        user[msg.sender]=true;
        members.push(msg.sender);
    }

    modifier OnlyRegisteredUser() {
        require(user[msg.sender], "Member is not registered.");
        _;
    }

    modifier OnlyAdmin(){
        require(user[msg.sender],"Only Admin can add or remove a member");
        _;
    }

    function split() public view OnlyAdmin returns (uint256) {
        require(members.length > 0, "No members to split among");
        return totalAmount / members.length;
    }

    function addMember(address _member) public OnlyRegisteredUser{
        require(!user[_member],"User is already a member");
        user[_member] = true;
        members.push(_member);
    }

    function removeMember(address _member) public OnlyAdmin{
        require(user[_member], "User is not a member");
        user[_member] = false;
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == _member) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }
    }

    function getMembers() public view returns (address[] memory) {
        return members;
    }
}
