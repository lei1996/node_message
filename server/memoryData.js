/** 内存数据存储键值 */
const MemoryDataStorageKey = {
  /** 封禁用户列表 */
  SealUserList: "SealUserList",
  /** 封禁ip列表 */
  SealIpList: "SealIpList",
  /** 新注册用户列表 */
  NewUserList: "NewUserList",
};

/** 内存数据 */
const memoryData = new Map();

/**
 * 更新指定键值数据
 * @param key 键值
 * @param set 新值
 */
function setMemoryData(key, set) {
  memoryData.set(key, set);
};

/**
 * 想指定键值添加数据
 * @param key 键值
 * @param value 要添加的值
 */
function addMemoryData(key, value) {
  if (value) {
    const set = memoryData.get(key);
    if (set) {
      set.add(value);
    }
  }
}

/**
 * 获取指定键值数据
 * @param key 键值
 */
function getMemoryData(key) {
  return memoryData.get(key) || new Set();
}

/**
 * 判断指定键值数据中是否存在目标值
 * @param key 键值
 * @param value 要判断的值
 */
function existMemoryData(key, value) {
  const set = memoryData.get(key);
  return set ? set.has(value) : false;
}

/**
 * 删除指定键值数据中的目标值
 * @param key 键值
 * @param value 要删除的值
 */
function deleteMemoryData(key, value) {
  if (value) {
    const set = memoryData.has(key);
    if (set) {
      set.delete(value);
    }
  }
}

// 自动初始化各个 key 的 value
Object.keys(MemoryDataStorageKey).forEach((key) => {
  setMemoryData(key, new Set());
});

module.exports = {
  MemoryDataStorageKey,
  setMemoryData,
  addMemoryData,
  getMemoryData,
  existMemoryData,
  deleteMemoryData,
};
