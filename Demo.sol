/* SPDX-License-Identifier: UNLICENSED */
pragma solidity >=0.7.0 <0.9.0;
contract Demo {
  address private owner;
  string name;
  event Echo(string message);

  constructor() {
    owner = msg.sender;
  }
  function changeName(string memory newName) public {
    name = newName;
  }
  function showName() public view returns(string memory) {
    return name;
  }
  function echo(string calldata message) external {
    emit Echo(message);
  }
}