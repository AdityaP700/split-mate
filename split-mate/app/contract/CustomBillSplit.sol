// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CustomBillSplit {
    uint256 public totalAmount;
    address public admin;

    mapping(address => bool) public isMember;
    address[] private members;
    mapping(address => uint256) public owedAmount;

    event MemberAdded(address member);
    event TotalAmountSet(uint256 amount);
    event BillSplit(uint256 totalSplit, uint256 expectedTotal);

    constructor() {
        admin = msg.sender;
        isMember[msg.sender] = true;
        members.push(msg.sender);
        emit MemberAdded(msg.sender);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this");
        _;
    }

    function addMember(address _member) public onlyAdmin {
        require(_member != address(0), "Invalid address");
        require(!isMember[_member], "User already a member");

        isMember[_member] = true;
        members.push(_member);
        emit MemberAdded(_member);
    }

    function setTotalAmount(uint256 _amount) public onlyAdmin {
        require(_amount > 0, "Amount must be positive");
        totalAmount = _amount;
        emit TotalAmountSet(_amount);
    }

    function split(uint256[] calldata amounts) public onlyAdmin {
        uint256 len = members.length;
        require(amounts.length == len, "Amounts and members mismatch");

        uint256 totalSplit = 0;

        for (uint256 i = 0; i < len; i++) {
            owedAmount[members[i]] = amounts[i];
            totalSplit += amounts[i];
        }

        emit BillSplit(totalSplit, totalAmount);
        require(totalSplit == totalAmount, "Total doesn't match splits");
    }

    function getMembers() external view returns (address[] memory) {
        return members;
    }

    function getOwedAmount(address _member) external view returns (uint256) {
        require(isMember[_member], "Not a member");
        return owedAmount[_member];
    }

    function resetOwedAmounts() public onlyAdmin {
        uint256 len = members.length;
        for (uint256 i = 0; i < len; i++) {
            owedAmount[members[i]] = 0;
        }
    }
}
