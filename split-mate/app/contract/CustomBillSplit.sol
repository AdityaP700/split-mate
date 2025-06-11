// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CustomBillSplit {
    uint256 public totalAmount;
    address public admin;

    mapping(address => bool) public user;
    address[] public members;
    mapping(address => uint256) public owedAmount;
    event DebugTotal(uint256 calculated, uint256 expected);
    constructor() {
        admin = msg.sender;
        user[msg.sender] = true;
        members.push(msg.sender);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this");
        _;
    }

    function addMember(address _member) public onlyAdmin {
        require(!user[_member], "User is already a member");
        user[_member] = true;
        members.push(_member);
    }

    function setTotalAmount(uint256 _amount) public onlyAdmin {
        totalAmount = _amount;
    }

    function split(uint256[] calldata amounts) public onlyAdmin {
        require(amounts.length == members.length, "Amounts and members mismatch");
        uint256 total = 0;

        for (uint256 i = 0; i < amounts.length; i++) {
            owedAmount[members[i]] = amounts[i];
            total += amounts[i];
        }
        emit DebugTotal(total, totalAmount);
        require(total == totalAmount, "Total doesn't match splits");
    }
}
