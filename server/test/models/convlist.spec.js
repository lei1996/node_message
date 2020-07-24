// const ConvList = require('../../models/convlist');

// describe('用户会话列表', function () {
//     describe('用户会话列表', function () {
//       beforeEach(async function () {
//         this.user = {
//           email: 'john@doe.com',
//           firstName: 'john',
//           lastName: 'doe',
//         }
//         this.ret = await SignUp.handler({ payload: this.user })
//       })
  
//       afterEach(async function () {
//         await User.deleteMany({})
//       })
  
//       it('creates the user in the database', async function() {
//         expect(await User.countDocuments()).to.equal(1)
//       })
  
//       it('returns user object', function() {
//         expect(this.ret).to.deep.include(this.user)
//       })
  
//       it('creates password hash')
  
//       it('throws an error when the user already exists')
//     })
//   })