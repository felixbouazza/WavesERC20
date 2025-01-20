// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "../interfaces/erc20.sol";

contract Waves is ERC20 {

    string public constant name = "Waves";
    string public constant symbol = "WAV";
    uint8 public constant decimals = 9;
    uint64 public constant _totalSupply = 2_000_000_000_000_000;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) spenders;

    constructor() {
        balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function totalSupply() external pure returns (uint64) {
        return _totalSupply;
    }

    function balanceOf(address _owner) external view returns (uint256 balance) {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _value) external returns (bool success) {
        require(_to != address(0));
        require(balances[msg.sender] >= _value);

        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success) {
        require(_to != address(0));
        require(spenders[_from][msg.sender] >= _value);
        require(balances[_from] >= _value);

        balances[_from] -= _value;
        spenders[_from][msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) external returns (bool success) {
        spenders[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function allowance(address _owner, address _spender) external view returns (uint256 remaining) {
        return spenders[_owner][_spender];
    }

}