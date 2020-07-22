
/**
 * 拦截未登录用户请求需要登录态的接口
 */
module.exports = function isLogin() {
    const noRequireLoginEvent = new Set([
        'register',
        'login',
        'loginByToken',
        'guest',
        'getDefaultGroupHistoryMessages',
        'getDefaultGroupOnlineMembers',
        'getBaiduToken',
    ]);
    return async (ctx, next) => {
        if (!noRequireLoginEvent.has(ctx.event) && !ctx.socket.user) {
            ctx.res = '请登录后再试';
            return;
        }
        await next();
    };
}
