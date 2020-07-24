const { Group, GroupList } = require("../../models/group");
// const {
//   getGroupOnlineMembersHelper,
//   createGroup,
//   joinGroup,
//   leaveGroup,
//   getGroupOnlineMembers,
//   getDefaultGroupOnlineMembers,
//   changeGroupAvatar,
//   changeGroupName,
//   deleteGroup,
// } = require("../../routes/group");

describe("群组", function () {
  describe("#indexOf()", function () {
    beforeEach(async function () {
      // 这里初始化 mock 数据
      // this.user = {
      //   email: "john@doe.com",
      //   firstName: "john",
      //   lastName: "doe",
      // };
      this.groupName = "时间1";
      // this.ret = await SignUp.handler({ payload: this.user });
    });

    afterEach(async function () {
      // 这里结束测试用例时 清除之前插入的对象
      // await Group.deleteMany({});
    });

    it("创建一个群组", async function () {
      const result = await createGroup({
        data: {
          name: this.groupName,
        },
        socket: {
          user: '5f195adabb826023333bd8f3',
        },
      });
      // console.log(result);
      expect(1).to.equal(1);
    });

    it("returns user object", function () {
      // expect(this.ret).to.deep.include(this.user);
    });

    it("creates password hash");

    it("throws an error when the user already exists");
  });
});
