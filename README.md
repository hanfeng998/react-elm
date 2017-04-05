# 前言
偶然看到这个用[vue2写的项目](https://github.com/bailicangdu/vue2-elm)，正好准备学习react，所以决定用react技术栈来实现这个项目.
# 项目截图
![v t2lusjm l3spefy8h bsr](https://cloud.githubusercontent.com/assets/7224044/24667206/36bb092c-1995-11e7-8d5e-359fa7bad8d6.png)
![1l f8_0l22tukjq 6zb2 s](https://cloud.githubusercontent.com/assets/7224044/24667250/69cd5d10-1995-11e7-8ef5-097010b0047d.png)
![ig8 8 4w o2ckig _6q7 v](https://cloud.githubusercontent.com/assets/7224044/24667275/810cd8ac-1995-11e7-8579-1473e6faf441.png)
![f10f2k5 r k6l 10wx3 tb](https://cloud.githubusercontent.com/assets/7224044/24667311/9eaaf4de-1995-11e7-83f6-c4d7d879f930.png)
![t y oea8 n_ilk3o 1 j5y](https://cloud.githubusercontent.com/assets/7224044/24667346/bcb5058c-1995-11e7-8fd4-3a05a9c4e437.png)
![ck68a9jnet_rp813 yrb g](https://cloud.githubusercontent.com/assets/7224044/24667368/d007b9ae-1995-11e7-84a8-4ebeb9d7ea5a.png)
# 技术栈
 react + react-router + redux + react-redux
# 项目运行和构建
 `npm start` 运行app，
 `npm run build` 构建生产环境app
# 性能
## code split
将每个路由模块封装到async component中，然后利用webpack的require.ensure(webpack2推荐使用system.import, 因为create-react-app目前使用的wepack1)来实现异步加载模块，下面是代码示意
```
  function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent((Component)=>{
          AsyncComponent.Component = Component
          this.setState({ Component })
        })
      }
    }
    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return <Loading></Loading>
    }
  }
}
const Home = asyncComponent((cb) =>
  require.ensure([], (require)=> {
     cb(require('./pages/home/home').default)
  })
)
```
## [progressive-web-apps](https://developers.google.com/web/progressive-web-apps/)
### 加入 service work
   生成的service work 会缓存静态的图片，javascript， css 和 html，甚至让应用在离线条件下也能工作。它也能节省数据和提高性能当应用，通过只网络请求已更新的资源。
   添加[sw-precache](https://github.com/GoogleChrome/sw-precache)依赖到package.json, 将这个命令sw-precache --config=sw-precache-config.js添加到build中, 如果你想缓存运行时资源，如ajax请求，可以查看sw-toolbox。
### 加入Web App Manifest
 `web app manifest` 提供关于你应用的元数据。可以用来触发添加到主屏的提示框，并且有和原生应用一样的加载效果。
## to do list
1. 规范处理react代码，如明确定义组件的props。render里尽可能不要有太多jsx，讲逻辑抽离成helper函数
2. 将页面组件分成更多小的组件
3. 下拉加载
4. 探讨runtime cache
5. 更多功能页面
