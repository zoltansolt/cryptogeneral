pragma solidity ^0.4.19;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {
    require(newOwner != address(0));
    OwnershipTransferred(owner, newOwner);
    owner = newOwner;
  }
}

contract General is Ownable {

    struct Unit {
        string name;
        uint16 type1;
        uint16 level;
        uint attack;
        uint defense;
        bool isForSale;
        uint curPrice;
        uint xp;
        uint trophy;
    }

    struct UnitType {
        uint16 type1;
        uint8 baseAttack;
        uint8 baseDefense;
        uint basePrice;
    }

    bool typesAreInitiated;
    bool isPaused;
    uint levelUpFee = 0.001 ether;
    uint unitsOnMarket = 0;

    UnitType[] public unitTypes;

    event NewUnit(uint unitId, string name);

    Unit[] public units;

    mapping (uint => address) public unitToOwner;
    mapping (address => uint) ownerUnitCount;

    modifier aboveLevel(uint _level, uint _unitId) {
      require(units[_unitId].level >= _level);
      _;
    }

    modifier ownerOf(uint _unitId) {
      require(msg.sender == unitToOwner[_unitId]);
      _;
    }

    function _createUnit(string _name, uint16 _type1, uint _attack, uint _defense) internal {
        uint id = units.push(Unit(_name, _type1, 1, _attack, _defense, false, 0, 0, 0)) - 1;
        unitToOwner[id] = msg.sender;
        ownerUnitCount[msg.sender]++;
        NewUnit(id, _name);
    }

    function addUnitType(uint16 _type1, uint8 _baseAttack, uint8 _baseDefense, uint _basePrice) private onlyOwner {
      unitTypes.push(UnitType(_type1, _baseAttack, _baseDefense, _basePrice));
    }

    function InitiatTypes() public onlyOwner {
      require(typesAreInitiated == false);
      unitTypes.push(UnitType(1, 10, 10, 0.05 ether));
    }

    function getUnitType(uint _id) public view returns (
      uint id,
      uint16 type1,
      uint8 baseAttack,
      uint8 baseDefense,
      uint basePrice
      ) {
        UnitType storage _ut = unitTypes[_id];
        id = _id;
        type1 = _ut.type1;
        baseAttack = _ut.baseAttack;
        baseDefense = _ut.baseDefense;
        basePrice = _ut.basePrice;
    }

    function purchaseNewUnit(uint _id, string _name) public payable {
      UnitType storage _ut = unitTypes[_id];
      require(msg.value == _ut.basePrice);
      _createUnit(_name, _ut.type1, _ut.baseAttack, _ut.baseDefense);
    }

    function purchaseUnit(uint _unitId) public payable {
  		require(msg.value == units[_unitId].curPrice);
      require(units[_unitId].isForSale == true);
  		require(isPaused == false);

  		uint commission = ((msg.value / 10)/2);

  		uint commissionToOwner = msg.value - commission;
  		unitToOwner[_unitId].transfer(commissionToOwner);

  		owner.transfer(commission);

  		unitToOwner[_unitId] = msg.sender;
      ownerUnitCount[msg.sender]++;
      units[_unitId].isForSale = false;
      unitsOnMarket--;
  	}

    function getNumberOfUnitTypes() public view returns(uint) {
      return unitTypes.length;
    }

    function getUnitsByOwner(address _owner) external view returns(uint[]) {
      uint[] memory result = new uint[](ownerUnitCount[_owner]);
      uint counter = 0;
      for (uint i = 0; i < units.length; i++) {
        if (unitToOwner[i] == _owner) {
          result[counter] = i;
          counter++;
        }
      }
      return result;
    }

    function getEnemies(address _owner) external view returns(uint[]) {
      uint[] memory result = new uint[](units.length - ownerUnitCount[_owner]);
      uint counter = 0;
      for (uint i = 0; i < units.length; i++) {
        if (unitToOwner[i] != _owner) {
          result[counter] = i;
          counter++;
        }
      }
      return result;
    }

    function getUnitsForSale() public view returns(uint[]) {
      uint[] memory unitsForSale = new uint[](unitsOnMarket);
      uint counter = 0;
      for (uint i = 0; i < units.length; i++) {
        if (units[i].isForSale == true) {
          unitsForSale[counter] = i;
          counter++;
        }
      }
      return unitsForSale;
    }

    function getUnit(uint _id) public view returns(
      uint id,
      string name,
      uint16 type1,
      uint16 level,
      uint attack,
      uint defense,
      bool isForSale,
      uint curPrice,
      address owner
      ) {
        Unit storage _units = units[_id];
        id = _id;
        name = _units.name;
        type1 = _units.type1;
        level = _units.level;
        attack = _units.attack;
        defense = _units.defense;
        isForSale = _units.isForSale;
        curPrice = _units.curPrice;
        owner = unitToOwner[_id];
    }

    function pauseGame() public onlyOwner {
        isPaused = true;
    }
    function unPauseGame() public onlyOwner {
        isPaused = false;
    }
    function GetIsPaused() public view returns(bool) {
       return(isPaused);
    }

    function setPrice(uint _unitId, uint _newPrice) ownerOf(_unitId) {
      require(_newPrice < units[_unitId].curPrice);
      units[_unitId].curPrice = _newPrice;
      units[_unitId].isForSale = true;
      unitsOnMarket++;
    }

    function withdraw() external onlyOwner {
      owner.transfer(this.balance);
    }

    function setLevelUpFee(uint _fee) external onlyOwner {
      levelUpFee = _fee;
    }

    function changeName(uint _unitId, string _newName) external aboveLevel(2, _unitId) ownerOf(_unitId) {
      units[_unitId].name = _newName;
    }

  uint randNonce = 0;

  function randMod(uint _modulus) internal returns(uint) {
    randNonce++;
    return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
  }

  function attack(uint _unitId, uint _targetId) external ownerOf(_unitId){
    Unit storage myUnit = units[_unitId];
    Unit storage enemyUnit = units[_targetId];
    uint rand1 = (randMod(100))/2;
    uint rand2 = (randMod(100))/2;
    uint attackOverall = ((100 + rand1) * myUnit.attack)/100;
    uint defenseOverall = ((100 + rand2) * enemyUnit.defense)/100;
    uint xpToLevelUp = ((myUnit.attack + myUnit.defense)/2) * 2;
    uint xpModifier = (enemyUnit.level - myUnit.level) * 2;
    if (xpModifier == 0) {
      xpModifier = 1;
    }
    uint xp = (enemyUnit.defense *  xpModifier)/10;
    if (xp < (myUnit.defense + myUnit.attack)/15) {
      xp = (myUnit.defense + myUnit.attack)/15;
    }
    if (xp > (myUnit.defense + myUnit.attack)) {
      xp = myUnit.defense + myUnit.attack;
    }
    if (attackOverall > defenseOverall) {
        myUnit.xp = myUnit.xp + xp;
        myUnit.trophy = myUnit.trophy + 30;
    } else {
      myUnit.trophy = myUnit.trophy - 28;
      if (myUnit.trophy < 0) {
        myUnit.trophy = 0;
      }
    }
    if (myUnit.xp >= xpToLevelUp) {
      myUnit.xp = 0;
      UnitType storage myUnitType = unitTypes[myUnit.type1 - 1];
      myUnit.attack = myUnit.attack + myUnitType.baseAttack/2;
      myUnit.defense = myUnit.defense + myUnitType.baseDefense/2;
      myUnit.level++;
    }
  }

}
